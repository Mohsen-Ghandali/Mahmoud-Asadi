import type { Metadata } from "next";
import {
  Big_Shoulders,
  DM_Sans,
  Noto_Naskh_Arabic,
  Playfair_Display,
  Vazirmatn,
} from "next/font/google";
import "./globals.css";

// Latin faces come first in each stack; Arabic glyphs fall through to the
// Persian faces automatically, so one stack serves both languages.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
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
      className={`${dmSans.variable} ${playfairDisplay.variable} ${bigShoulders.variable} ${vazirmatn.variable} ${notoNaskhArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
