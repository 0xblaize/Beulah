import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Geist, Geist_Mono } from "next/font/google";
import { Frame } from "@/components/Frame";
import { StageLoader } from "@/components/StageLoader";
import "./globals.css";

const display = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
});

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: { default: "Beulah", template: "%s · Beulah" },
  description:
    "The creator & brand marketplace. Where brands meet influence. Where creators meet opportunity.",
  // CC BY 3.0 asks for attribution; the visible footer credit was removed, so it lives here.
  other: {
    "model-credit": "3D head scan by Lee Perry-Smith, CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/)",
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <StageLoader />
        <Frame>{children}</Frame>
      </body>
    </html>
  );
}
