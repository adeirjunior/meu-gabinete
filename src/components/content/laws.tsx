import { getSession } from "@/lib/auth/get-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/configs/prisma";
import LawCard from "../card/law-card-dashboard";
import Image from "next/image";
import { Grid } from "@tremor/react";

export type contentArray = {
  websiteId: string;
  limit?: number;
};

export default async function Laws({ websiteId, limit }: contentArray) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  const laws = await prisma.law.findMany({
    where: {
      websiteId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      website: true,
    },
    ...(limit ? { take: limit } : {}),
  });

  return laws.length > 0 ? (
    <Grid numItemsMd={2} numItemsLg={3} className="gap-4 w-full">
      {laws.map((law) => (
        <LawCard key={law.id} data={law} />
      ))}
    </Grid>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">Sem leis ainda</h1>
      <Image
        alt="missing law"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        Você não tem nenhuma lei ainda. Crie uma para começar.
      </p>
    </div>
  );
}
