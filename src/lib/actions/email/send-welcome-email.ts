"use server";
import { getSession } from "@/lib/auth/get-session";
import resend from "@/lib/configs/resend";
import prisma from "@/lib/configs/prisma";
import { randomUUID } from "crypto";
import WelcomeEmail from "@/components/emails/welcome-politician";

export const sendWelcomeEmail = async (formData: FormData) => {
  const session = await getSession();

  if (!session) {
    throw new Error("Você não esta logado (sessão vazia).");
  }

  const email = formData.get("email") as string;
const user = await prisma.user.findUnique({
  where: {
    id: session.user.id
  },
  include: {
    politician: {include: {
      website: true
    }},
    admin: true
  }
})

const websiteId =
  user?.politician?.website?.id || user?.admin?.websiteId!;
const inviteTokenExpiry = new Date();
inviteTokenExpiry.setMinutes(inviteTokenExpiry.getMinutes() + 15);

  try {
   const invite = await prisma.userInvite.create({
      data: {
        invitedEmail: email,
        inviteToken: randomUUID(),
        inviteTokenExpiry,
        websiteId
      },
      include: {
        toAdminWebsite: {
          include: {
            politician: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    return await resend.emails.send({
      from: "E-Gab <no-reply@simplesgov.com.br>",
      to: invite.invitedEmail,
      subject: `Você foi convidado por ${session.user.name} para administrar o site do político ${invite.toAdminWebsite.politician.user.name}`,
      react: WelcomeEmail(),
    });
  } catch (error) {}
};
