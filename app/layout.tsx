import type { Metadata } from "next";
import { Fraunces, Space_Grotesk, Caveat } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iasmi.ro"),
  title: {
    default: "Customs by Iasmi — custom sneakers & wearable art, painted by hand",
    template: "%s · Customs by Iasmi",
  },
  description:
    "A personal creative studio for hand-painted sneakers and wearable art. One-of-one commissions painted by hand, plus custom graduation caps.",
  keywords: [
    "custom sneakers",
    "hand-painted sneakers",
    "wearable art",
    "sneaker commission",
    "custom graduation cap",
    "iasmi",
  ],
  openGraph: {
    title: "Customs by Iasmi — custom sneakers & wearable art",
    description:
      "One-of-one sneakers, painted by hand. Send the mood, wear the artwork.",
    url: "https://iasmi.ro",
    siteName: "Customs by Iasmi",
    type: "website",
    images: ["/work/graduation-caps/both-caps.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${grotesk.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-rose focus:px-4 focus:py-2 focus:text-ink focus:text-sm"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
