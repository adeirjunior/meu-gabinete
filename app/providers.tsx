"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/modal/provider";
import { useRouter } from "next/navigation";
import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <SessionProvider>
      <Toaster className="dark:hidden" />
      <Toaster theme="dark" className="hidden dark:block" />
      <NextUIProvider navigate={router.push}>
          <ModalProvider>{children}</ModalProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
