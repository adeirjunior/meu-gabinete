"use server"

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Politician } from "@prisma/client";

export const createPolitician = async () => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  try {
    const response: Politician = await prisma.politician.create({
      data: {
        party: "Partido Genérico",
        User: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};