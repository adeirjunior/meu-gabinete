"use server";

import { getSession } from "@/lib/auth/get-session";
import prisma from "@/lib/configs/prisma";
import { getWebsiteByUserId } from "@/lib/fetchers/site";
import { hasSubscription } from "@/lib/helpers/billing";

export const updateContact = async (
  formData: FormData,
  _id: unknown,
  key: string,
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const hasSub = await hasSubscription();

  if (user?.role === "politician" && !hasSub) {
    return {
      error: `Você precisa assinar um plano para realizar este comando.`,
    };
  }

  const value = formData.get(key) as string;

  try {
    const site = await getWebsiteByUserId(session.user.id);

    let response;

    if (key === "location") {
      response = await prisma.contact.update({
        data: {
          location: {
            create: {
              adr_address: "",
              formatted_address: "",
              lat: 0,
              lng: 0,
              name: "",
              url: "",
            },
          },
        },
        where: {
          id: site?.contactId ?? undefined,
        },
      });
    } else {
      response = await prisma.contact.update({
        where: {
          id: site?.contactId ?? undefined,
        },
        data: {
          [key]: value,
        },
      });
    }

    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This ${key} is already in use`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};
