import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Motion } from "@/components/Motion";
import { SideRail } from "@/components/SideRail";
import { NowPlaying } from "@/components/NowPlaying";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

const defaultTitle = `${site.name} · Yale Law, Stanford GSB`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s · ${site.name}` },
  description: site.description,
  alternates: { canonical: "./" },
  openGraph: { title: defaultTitle, description: site.description, siteName: site.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.description },
};

// Tells search engines who the site is about, so "Frank Kim" searches can match it to this person.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: ["Francis Kim"],
  url: site.url,
  image: `${site.url}/about/portrait-wall.png`,
  jobTitle: "JD Candidate, Yale Law School",
  affiliation: { "@type": "CollegeOrUniversity", name: "Yale Law School" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Stanford Graduate School of Business" },
    { "@type": "CollegeOrUniversity", name: "United States Naval Academy" },
  ],
  award: "Knight-Hennessy Scholar",
  sameAs: [site.links.linkedin],
};

export const viewport: Viewport = {
  themeColor: "#f4efe6",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }} />
        <a href="#main" className="skip">Skip to content</a>
        <Motion>
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
          <SideRail />
          <NowPlaying />
        </Motion>
        <Analytics />
      </body>
    </html>
  );
}
