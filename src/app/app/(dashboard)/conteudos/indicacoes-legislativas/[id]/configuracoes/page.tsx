import prisma from "@/lib/configs/prisma";
import { notFound, redirect } from "next/navigation";
import Form from "@/components/form";
import { getSession } from "@/lib/auth/get-session";
import { getUserById } from "@/lib/fetchers/user";
import ImageForm from "@/components/form/image-form";
import { getWebsiteByUserId } from "@/lib/fetchers/site";
import { getGalleryImages } from "@/lib/fetchers/image";
import DeleteContentForm from "@/components/form/delete-content-form";
import { updateLawMetadata } from "@/lib/actions/law/law.update.action";
import { deleteLegislativeIndication } from "@/lib/actions/legislative-indication/legislative-indication.delete.action";

export default async function LawSettings({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const legislativeIndication = await prisma.legislativeIndication.findUnique({
    where: {
      id: params.id,
    },
  });

  const user = await getUserById(session.user.id);

  if (!legislativeIndication) {
    notFound();
  }

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  if (user.role === "admin" && !user.admin?.canEditLaws) {
    throw new Error("Você não tem permissão para editar indicações legislativs.");
  }

  const website = await getWebsiteByUserId(session.user.id);
  const { resources } = await getGalleryImages(website?.cloudinaryDir!);

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-6">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Configurações da Indicação Legislativa
        </h1>
        <Form
          title="Indicação Legislativa Slug"
          description="O slug é uma url amigável. Geralmente toda em minusculo e possui apenas letras, nómeros e hifens."
          helpText="Favoer usar um slug que é unico para esta indicação legislativa."
          inputAttrs={{
            name: "slug",
            type: "text",
            defaultValue: legislativeIndication?.slug!,
            placeholder: "slug",
          }}
          handleSubmit={updateLawMetadata}
        />

        <ImageForm
          resources={resources}
          title="Thumbnail"
          description="A thumbnail da sua indicação legislativa. Formatos aceitos: .png, .jpg, .jpeg"
          helpText="Arquivo de no máximo 5MB. Tamanho recomendado 1200x630."
          inputAttrs={{
            name: "image",
            defaultValue: legislativeIndication?.image!,
          }}
          handleSubmit={updateLawMetadata}
        />

        <DeleteContentForm
          handle={deleteLegislativeIndication}
          contentName={legislativeIndication?.title!}
        >
          Deletar indicação legislativa
        </DeleteContentForm>
      </div>
    </div>
  );
}
