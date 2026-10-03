import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Motion } from "@/components/Motion";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url.includes("[") ? "http://localhost:3000" : site.url),
  title: { default: site.name, template: `%s — ${site.name}` },
  description: site.description,
  alternates: { canonical: "./" },
  openGraph: { siteName: site.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f4efe6",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="skip">Skip to content</a>
        <Motion>
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
        </Motion>
        <Analytics />
      </body>
    </html>
  );
}
