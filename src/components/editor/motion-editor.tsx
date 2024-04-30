/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useTransition } from "react";
import { PoliticianMotion } from "@prisma/client";
import TextareaAutosize from "react-textarea-autosize";
import { cn, getCurrentDomain } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button, Link } from "@nextui-org/react";
import { useDebounce } from "usehooks-ts";
import { Editor as NovelEditor } from "novel";
import { updateMotion, updateMotionMetadata } from "@/lib/actions/motion/motion.update.action";

export type MotionWithSite = PoliticianMotion & {
  website: { subdomain: string | null };
};

export default function MotionEditor({ motion }: { motion: MotionWithSite }) {
  const [isPendingSaving, startTransitionSaving] = useTransition();
  const [isPendingPublishing, startTransitionPublishing] = useTransition();
  const [data, setData] = useState<MotionWithSite>(motion);
  const debouncedData = useDebounce(data, 750);

  const url = getCurrentDomain(data.website?.subdomain!, `/mocoes/${data.slug}`);

  const isSync =
    data.title === motion.title &&
    data.description === motion.description &&
    data.content === motion.content;

  useEffect(() => {
    if (isSync) {
      return;
    }

    startTransitionSaving(async () => {
      const response = await updateMotion(data);

      if ("error" in response) {
        toast.error(response.error);
      }
    });
  }, [debouncedData, startTransitionSaving]);

  const togglePublish = async () => {
    const formData = new FormData();
    formData.append("published", String(!data.published));
    startTransitionPublishing(async () => {
      try {
        if (!data.title || !data.description || !data.content) {
          toast.error("Impossível publicar sem conteúdo.");
        } else {
          const response = await updateMotionMetadata(
            formData,
            motion.id,
            "published",
          );

          if (response.error) {
            toast.error(response.error);
          } else {
            setData((prev) => ({ ...prev, published: !prev.published }));
            toast.success(
              `Seu motion foi ${
                data.published ? "despublicado" : "publicado"
              } com sucesso.`,
            );
          }
        }
      } catch (error) {
        console.error("Erro ao atualizar metadata:", error);
        toast.error("Erro ao atualizar metadata das moções");
      }
    });
  };

  return (
    <div className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 dark:border-stone-700 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg">
      <div className="absolute right-5 top-5 mb-5 flex items-center space-x-3">
        {data.published && (
          <Button
            isIconOnly
            variant="bordered"
            as={Link}
            href={url}
            target="_blank"
            isExternal
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-stone-400 hover:text-stone-500"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
        <div
          className={cn(
            "rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400 dark:bg-stone-800 dark:text-stone-500",
            {
              "bg-stone-100": isPendingSaving,
              "bg-stone-800 text-stone-300": isPendingSaving,
            },
          )}
        >
          {isPendingSaving ? "Salvando..." : isSync ? "Salvo" : "Não salvo"}
        </div>
        <Button
          onClick={togglePublish}
          className={cn(
            "flex h-7 w-24 items-center justify-center space-x-2 rounded-lg border text-sm transition-all focus:outline-none",
            {
              "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300":
                isPendingPublishing,
              "border border-black bg-black text-white hover:bg-white hover:text-black active:bg-stone-100 dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800":
                !isPendingPublishing,
            },
          )}
          disabled={isPendingPublishing}
        >
          {isPendingPublishing ? (
            <LoadingDots />
          ) : (
            <p className="m-0">{data.published ? "Despublicar" : "Publicar"}</p>
          )}
        </Button>
      </div>
      <div className="mb-5 flex flex-col space-y-3 border-b border-stone-200 pb-5 dark:border-stone-700">
        <input
          type="text"
          placeholder="Título"
          defaultValue={motion.title || ""}
          autoFocus
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="dark:placeholder-text-600 font-cal border-none px-0 text-3xl placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
        />
        <TextareaAutosize
          placeholder="Descrição"
          defaultValue={motion.description || ""}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
        />
        <NovelEditor
          className="relative block"
          disableLocalStorage
          defaultValue={motion.content || ""}
          onUpdate={(editor) => {
            setData((prev) => ({
              ...prev,
              content: editor?.storage.markdown.getMarkdown(),
            }));
          }}
        />
      </div>
    </div>
  );
}