import { getSession } from "@/lib/auth/get-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/configs/prisma";
import PostCard from "../card/post-card-dashboard";
import Image from "next/image";

export type contentArray = {
  websiteId: string;
  limit?: number;
};

export default async function Posts({ websiteId, limit }: contentArray) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  const posts = await prisma.post.findMany({
    where: {
      websiteId
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      website: true,
    },
    ...(limit ? { take: limit } : {}),
  });

  return posts.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {posts.map((post) => (
        <PostCard key={post.id} data={post} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">Sem posts ainda</h1>
      <Image
        alt="missing post"
        src="https://illustrations.popsy.co/gray/graphic-design.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        Você não tem nenhum post ainda. Crie um para começar.
      </p>
    </div>
  );
}
