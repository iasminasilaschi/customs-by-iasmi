"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { localePath, splitLocale } from "@/lib/i18n";

// a Client Component: the language comes from the URL, the words from here
const words = {
  en: {
    kicker: "oops — paint everywhere",
    a: "Something",
    em: "smudged.",
    text: "This page tripped over its own brush. Give it another go, or head back to the studio. If it keeps happening, tell me and I'll fix it.",
    retry: "Try again",
    home: "Back home",
  },
  ro: {
    kicker: "ups, vopsea peste tot",
    a: "Ceva s-a",
    em: "întins.",
    text: "Pagina asta s-a împiedicat în propria pensulă. Mai încearcă o dată sau întoarce-te în studio. Dacă se tot întâmplă, spune-mi și repar.",
    retry: "Încearcă din nou",
    home: "Înapoi acasă",
  },
};

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  const { locale } = splitLocale(usePathname() || "/");
  const t = words[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="gutter flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
      <p className="hand rotate-[-2deg] text-3xl text-lilac">{t.kicker}</p>
      <h1 className="display mt-4 text-[clamp(2.5rem,1.5rem+3.4vw,4.25rem)]">
        {t.a} <span className="display-italic text-rose-2">{t.em}</span>
      </h1>
      <p className="mt-4 max-w-sm text-sm text-muted">{t.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button type="button" onClick={() => retry()}>
          {t.retry}
        </Button>
        <Button href={localePath(locale, "/")} variant="outline">
          {t.home}
        </Button>
      </div>
    </div>
  );
}
