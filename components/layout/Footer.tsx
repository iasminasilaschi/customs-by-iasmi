import Link from "next/link";
import { site, navLinks } from "@/data/site";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n-server";

const socials = [
  { href: site.instagram, label: "Instagram" },
  { href: site.tiktok, label: "TikTok" },
];

export async function Footer() {
  const { locale, t } = await getI18n();
  const pages = navLinks.filter((l) => l.href !== "/").map((l) => ({ href: localePath(locale, l.href), label: t.nav[l.key] }));
  return (
    <footer className="relative mt-28 bg-deep text-paper">
      <div className="gutter mx-auto max-w-[90rem] pt-16 pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="leading-none">
              <span className="hand block text-xl text-champagne">customs by</span>
              <span className="hand text-4xl text-paper">Iasmi</span>
            </p>
            <p className="mt-4 text-base leading-relaxed text-paper/70">
              {t.footer.blurb}
            </p>
            <p className="hand mt-5 rotate-[-1.5deg] text-xl text-champagne">
              {t.footer.motto}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <p className="mb-4 text-[0.8rem] uppercase tracking-[0.24em] text-champagne">
                {t.footer.explore}
              </p>
              <ul className="-my-1.5 text-base">
                {pages.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-11 items-center text-paper/70 transition-colors hover:text-paper">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[0.8rem] uppercase tracking-[0.24em] text-champagne">
                {t.footer.sayHi}
              </p>
              <ul className="-my-1.5 text-base">
                {socials.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-paper/70 transition-colors hover:text-paper"
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
          <p>
            © {new Date().getFullYear()} Customs by Iasmi — {t.footer.copyright}{" "}
            <span className="whitespace-nowrap">{t.footer.oneOfOne}</span>
          </p>
          <p>
            {t.footer.tagline}{" "}
            <Link
              href={localePath(locale, "/privacy")}
              className="-my-3 inline-flex min-h-11 items-center underline-offset-2 transition-colors hover:text-paper hover:underline"
            >
              {t.footer.privacy}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
