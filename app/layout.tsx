import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Providers } from "@/components/providers";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Clip Aja",
  description: "Bangun Awarenessmuu dengan sekali ketuk",
  other: {
    "dicoding:email": "muhammadbaharuddin08123@gmail.com"
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <Head>
        <meta name="dicoding:email" content="muhammadbaharuddin08123@gmail.com" />
      </Head>
      <body
        className={` antialiased`}
      >
        <Providers>
          <NextIntlClientProvider>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
