import "@/styles/globals.css";
import { cal, inter, raleway } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@govbr-ds/core/dist/core.min.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

const title = "Meu Gabinete";
const description = "Generated by create next app";
const image = "https://vercel.pub/thumbnail.png";

export const metadata: Metadata = {
  title,
  description,
  icons: ["https://vercel.pub/favicon.ico"],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: "@vercel",
  },
  metadataBase: new URL("https://vercel.pub"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={cn(raleway.variable, cal.variable, inter.variable)}>
        <Providers>
          {children}
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
