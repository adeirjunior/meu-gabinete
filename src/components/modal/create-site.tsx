"use client";

import { toast } from "sonner";
import { createSite } from "@/lib/actions/website/website.create.action";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "./provider";
import va from "@vercel/analytics";
import { Button, Input, Textarea, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { generate } from "random-words";
import { RegexIcon } from "lucide-react";
import { useEffectOnce } from "usehooks-ts";

export default function CreateSiteModal() {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    name: "",
    subdomain: "",
    description: "",
  });

  const randomSubdomain = () => {
    setData((prev) => ({
      ...prev,
      subdomain: generate({ exactly: 8, join: "-" }),
    }));
  };

  useEffectOnce(() => {
    setData((prev) => ({
      ...prev,
      subdomain: generate({ exactly: 8, join: "-" }),
    }));
  });

  return (
    <form
      action={async (formData: FormData) =>{
        formData.append("subdomain", data.subdomain)
        createSite(formData).then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            va.track("Created Site");
            modal?.hide();
            toast.success(`Site criado com sucesso!`);
            router.push("/");
          }
        })}
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
        <h2 className="font-cal text-2xl dark:text-white">Crie seu site</h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Nome do Site
          </label>
          <Input
            name="name"
            autoComplete="no"
            type="text"
            placeholder="Meu site incrível"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={32}
            required
            variant="bordered"
            classNames={{
              input: "dark:text-gray-200",
            }}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="subdomain"
            className="text-sm font-medium text-stone-500"
          >
            Subdomínio
          </label>
          <div className="flex w-full max-w-md">
            <Input
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-small text-default-400">https://</span>
                </div>
              }
              name="subdomain"
              autoComplete="no"
              variant="bordered"
              radius="none"
              endContent={
                <Tooltip offset={16} content="Gerar subdomínio">
                  <Button
                    className="border-stone-200 bg-stone-100 dark:border-stone-600 dark:bg-stone-800"
                    onPress={() => randomSubdomain()}
                    isIconOnly
                  >
                    <RegexIcon />
                  </Button>
                </Tooltip>
              }
              type="text"
              placeholder="subdomínio"
              value={data.subdomain}
              autoCapitalize="off"
              description="Você poderá alterar seu subdomínio, ou colocar um domínio próprio após assinar algum de nossos planos."
              pattern="[a-zA-Z0-9\-]+"
              required
              disabled
              classNames={{
                inputWrapper: "rounded-s-xl",
                input: "dark:text-gray-200",
              }}
            />
            <div className="flex h-fit items-center rounded-r-lg border border-l-0 border-stone-200 bg-stone-100 px-3 py-[17px] text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400">
              .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-stone-500"
          >
            Descrição
          </label>
          <Textarea
            name="description"
            placeholder="Dê um resumo simples para seu site"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            maxLength={140}
            rows={3}
            variant="bordered"
            className="text-gray-200"
            classNames={{
              input: "dark:text-gray-200",
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <CreateSiteFormButton />
      </div>
    </form>
  );
}

function CreateSiteFormButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className={cn(
        "flex h-10 w-full items-center justify-center space-x-2 rounded-md border text-sm transition-all focus:outline-none",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : " border-stone-700 bg-black text-white hover:border-stone-200 hover:bg-black hover:text-white active:bg-stone-800",
      )}
      disabled={pending}
    >
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p className="m-0 text-gray-200">Criar Site</p>
      )}
    </Button>
  );
}
