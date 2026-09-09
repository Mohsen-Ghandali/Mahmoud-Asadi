import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Naskh_Arabic, Vazirmatn } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "دفتر وکالت",
  description: "دفتر وکالت و مشاوره حقوقی",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} ${notoNaskhArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-persian">{children}</body>
    </html>
  );
}
