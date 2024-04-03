import prisma from "@/lib/configs/prisma";
import { notFound, redirect } from "next/navigation";
import Form from "@/components/form";
import { updatePostMetadata } from "@/lib/actions/post/post.update.action";
import DeletePostForm from "@/components/form/delete-post-form";
import { getSession } from "@/lib/auth/get-session";

export default async function PostSettings({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const data = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
    user: {
      include: {
        admin: true
      }
    }
    },
  });

  if (!data) {
    notFound();
  }

  if(!data.user.admin?.canEditPosts) {
    throw new Error("Você não tem permissão para editar posts.")
  }
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-6">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Configurações do Post
        </h1>
        <Form
          title="Post Slug"
          description="O slug é uma url amigável. Geralmente toda em minusculo e possui apenas letras, nómeros e hifens."
          helpText="Favoer usar um slug que é unico para este post."
          inputAttrs={{
            name: "slug",
            type: "text",
            defaultValue: data?.slug!,
            placeholder: "slug",
          }}
          handleSubmit={updatePostMetadata}
        />

        <Form
          title="Thumbnail"
          description="A thumbnail do seu post. Formatos aceitos: .png, .jpg, .jpeg"
          helpText="Arquivo de no máximo 5MB. Tamanho recomendado 1200x630."
          inputAttrs={{
            name: "image",
            type: "file",
            defaultValue: data?.image!,
          }}
          handleSubmit={updatePostMetadata}
        />

        <DeletePostForm postName={data?.title!} />
      </div>
    </div>
  );
}
