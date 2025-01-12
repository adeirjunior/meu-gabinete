import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { getSiteData } from "@/lib/fetchers/site";
import { fontMapper } from "@/styles/fonts";
import { Metadata } from "next";
import { NextThemeProvider } from "@/app/next-themes-provider";
import Header from "@/components/website/header";
import Footer from "@/components/website/footer";
import prisma from "@/lib/configs/prisma";
import cloudinary from "@/lib/configs/cloudinary";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);
  if (!data) {
    return null;
  }
  const {
    name: title,
    description,
    image,
    logo,
  } = data as {
    name: string;
    description: string;
    image: string;
    logo: string;
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [cloudinary.v2.url(image)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [cloudinary.v2.url(image)],
      creator: "@vercel",
    },
    icons: [cloudinary.v2.url(logo)],
    metadataBase: new URL(`https://${domain}`),
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   data.customDomain && {
    //     alternates: {
    //       canonical: `https://${data.customDomain}`,
    //     },
    //   }),
  };
}

// Não utilize useSession() neste arquivo, ele causará um erro 500 na página inicial de todos os subdomínios

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) {
    notFound();
  }

  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.customDomain}`);
  }

  const socials = await prisma.socialMedia.findMany({
    where: {
      website: {
        id: data.id,
      },
    },
  });

  return (
    <NextThemeProvider attribute="class" defaultTheme="light">
      <div className={fontMapper[data.font]}>
        <Header data={data} />

        <div className="min-h-screen flex flex-col gap-8">{children}</div>

        <Footer data={data} socials={socials} />
      </div>
    </NextThemeProvider>
  );
}
