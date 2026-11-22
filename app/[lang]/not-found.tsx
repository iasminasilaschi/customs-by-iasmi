import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n-server";

// not-found pages get no params: a neutral, two-language title
export const metadata: Metadata = {
  title: "Page not found · Pagina nu există",
  robots: { index: false },
};

export default async function NotFound() {
  const { locale, t: d } = await getI18n();
  const t = d.notFound;
  return (
    <div className="gutter flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
      <p className="hand rotate-[-2deg] text-3xl text-lilac">{t.kicker}</p>
      <h1 className="display mt-4 text-[clamp(2.5rem,1.5rem+3.4vw,4.25rem)]">
        {t.titleA} <span className="display-italic text-rose-2">{t.titleEm}</span>
      </h1>
      <p className="mt-4 max-w-sm text-sm text-muted">{t.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href={localePath(locale, "/")}>{t.home}</Button>
        <Button href={localePath(locale, "/projects")} variant="outline">
          {t.projects}
        </Button>
      </div>
    </div>
  );
}
