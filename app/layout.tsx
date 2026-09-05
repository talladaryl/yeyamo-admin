import type { Metadata } from "next";
import localFont from "next/font/local";
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
  title: "YeYamo | Explorez le Cameroun en toute liberté",
  description:
    "Landing page YeYamo haute fidélité mettant en valeur la découverte du Cameroun, les expériences locales et la communauté."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
