import Link from "next/link";
import { site, navLinks } from "@/data/site";

const pages = navLinks.filter((l) => l.href !== "/");
const socials = [
  { href: site.instagram, label: "Instagram" },
  { href: site.tiktok, label: "TikTok" },
];

export function Footer() {
  return (
    <footer className="relative mt-28 bg-deep text-paper">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-12 xl:px-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="leading-none">
              <span className="hand block text-xl text-champagne">customs by</span>
              <span className="hand text-4xl text-paper">Iasmi</span>
            </p>
            <p className="mt-4 text-base leading-relaxed text-paper/70">
              Custom sneakers and graduation caps, painted by hand, one at a
              time, in {site.location}.
            </p>
            <p className="hand mt-5 rotate-[-1.5deg] text-xl text-champagne">
              send the mood, wear the artwork
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <p className="mb-4 text-[0.8rem] uppercase tracking-[0.24em] text-champagne">
                Explore
              </p>
              <ul className="space-y-3 text-base">
                {pages.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-paper/70 transition-colors hover:text-paper">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[0.8rem] uppercase tracking-[0.24em] text-champagne">
                Say hi on
              </p>
              <ul className="space-y-3 text-base">
                {socials.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-paper/70 transition-colors hover:text-paper"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-paper/15 pt-6 text-sm text-paper/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Customs by Iasmi — every pair is a one-of-one.</p>
          <p>
            Hand-painted · sealed for real life ·{" "}
            <Link href="/privacy" className="underline-offset-2 transition-colors hover:text-paper hover:underline">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
