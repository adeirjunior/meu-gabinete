import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/configs/prisma";
import Credentials from "next-auth/providers/credentials";
import { UserRole } from "@prisma/client";
import { AuthenticatedUser } from "../types/types";
import { ErrorType, userService } from "../services/user.service";
import { createEveryUserVariant } from "../utils/createEveryUserVariant";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

type UserCredentialsConfig<T> = {
  name: string;
  credentials: T;
  authorize: (
    credentials: Record<string, string> | undefined,
    req: any,
  ) => Promise<any>;
};

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? "invited",
          emailVerified: profile.email_verified ?? null,
        };
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "string" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        req,
      ): Promise<AuthenticatedUser | ErrorType> {
        const { email, password, role } = credentials as {
          email: string;
          password: string;
          role: UserRole;
        };

        try {
          const user = await userService.authenticate(email, password);

          if ("error" in user) {
            console.error("Erro de autenticação:", user.error);
            return {
              error: {
                message: user.error,
              },
            } as unknown as ErrorType;
          }

          return user as AuthenticatedUser;
        } catch (error) {
          console.error("Erro ao autorizar credenciais:", error);
          return {
            error: {
              message: "Internal server error",
            },
          } as ErrorType;
        }
      },
    } as UserCredentialsConfig<{
      email: { label: string; type: string; placeholder: string };
      password: { label: string; type: string };
      role: { label: string; type: string };
    }>),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login",
    newUser: "/novo-usuario",
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    async signIn({ user }) {
      try {
        const isNotFound = "error" in user;
        if (isNotFound) {
          console.error("Erro de login:", user.error);
          return false;
        }

        // Verifica se o usuário já existe no banco de dados
        const dbUser = await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });

        // Se o usuário não existir, envia o e-mail de verificação
        if (!dbUser) {
          await createEveryUserVariant(user.id);
        }

        return true;
      } catch (error) {
        console.error("Erro no callback signIn:", error);
        return false;
      }
    },
    jwt: async ({ token, user }) => {
      try {
        if (user) {
          const dbUser = await prisma.user.findUnique({
            where: {
              id: user.id,
            },
          });

          token.user = user as any;

          if (dbUser) {
            token.user.role = dbUser.role;
            token.user.image = dbUser.image;
          }
        }

        return token;
      } catch (error) {
        console.error("Erro no callback JWT:", error);
        throw new Error("Erro ao gerar o JWT");
      }
    },
    session: async ({ session, token }) => {
      try {
        if (token) {
          session.user = {
            ...session.user,
            stripeCustomerId: token.user.stripeCustomerId,
            id: token.user.id,
            username: token.user.username || token.user.gh_username,
            role: token.user.role,
            ...(token.picture
              ? { image: token.picture }
              : { image: token.user.image }),
          };
        }

        return session;
      } catch (error) {
        console.error("Erro no callback session:", error);
        throw new Error("Erro ao criar sessão");
      }
    },
  },
};
