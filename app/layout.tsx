import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "./globals.css";
import { AppProviders } from "@/app/providers";

const headingFont = localFont({
  src: [
    {
      path: "../public/fonts/Heading-Regular.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../public/fonts/Heading-SemiBold.ttf",
      weight: "600",
      style: "normal"
    }
  ],
  variable: "--font-heading",
  display: "swap"
});

const bodyFont = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Regular.otf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../public/fonts/Inter-SemiBold.otf",
      weight: "600",
      style: "normal"
    }
  ],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  title: "YeYamo | Explorer l’Afrique à travers YeYamo.",
  description:
    "Landing page YeYamo haute fidélité mettant en valeur la découverte du Cameroun, les expériences locales et la communauté."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get("x-yeyamo-lang") === "en" ? "en" : "fr";
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
