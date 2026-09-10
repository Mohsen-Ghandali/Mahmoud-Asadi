import type { Metadata } from "next";
import {
  Big_Shoulders,
  Montserrat,
  Vazirmatn,
} from "next/font/google";
import "./globals.css";

// Latin faces come first in each stack; Arabic glyphs fall through to the
// Persian faces automatically, so one stack serves both languages.
const montserrat = Montserrat({
  variable: "--font-montserrat",
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

export const metadata: Metadata = {
  title: "دفتر وکالت",
  description: "دفتر وکالت و مشاوره حقوقی",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${montserrat.variable} ${bigShoulders.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
