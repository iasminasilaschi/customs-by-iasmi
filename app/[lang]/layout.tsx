import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Space_Grotesk, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { LanguagePrompt } from "@/components/layout/LanguagePrompt";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, locales, ogLocale } from "@/lib/i18n";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, languageAlternates } from "@/lib/metadata";

// latin-ext carries Romanian's ă ș ț (latin alone only has â î)
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.title, template: `%s · ${SITE_NAME}` },
    description: t.description,
    keywords: t.keywords,
    // the homepage's; every other page sets its own (lib/metadata.ts)
    alternates: languageAlternates(lang, "/"),
    openGraph: {
      title: t.ogTitle,
      description: t.ogDescription,
      url: lang === "en" ? "/" : `/${lang}`,
      siteName: SITE_NAME,
      type: "website",
      locale: ogLocale[lang],
      images: [DEFAULT_OG_IMAGE],
    },
    // per-page title/description/image come from the og: tags (see lib/metadata.ts)
    twitter: { card: "summary_large_image" },
  };
}

/*
  viewport-fit=cover lets the page run under the iPhone's notch and home bar,
  so backgrounds reach the screen edges. Content keeps clear of them with the
  safe-area insets: .gutter (sides), the nav (top) and the footer (bottom).
*/
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${grotesk.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-rose focus:px-4 focus:py-2 focus:text-ink focus:text-sm"
        >
          {t.meta.skip}
        </a>
        <Nav locale={lang} t={t.nav} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <LanguagePrompt locale={lang} />
        <Analytics />
      </body>
    </html>
  );
}
