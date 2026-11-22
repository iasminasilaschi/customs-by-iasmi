import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/data/site";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).privacy;
  return pageMetadata({ locale: lang, title: t.metaTitle, description: t.metaDescription, path: "/privacy" });
}

/*
  Long prose with links inline reads best written out in full, so each
  language is its own block below rather than dictionary entries.
  Keep the two in step: change one, change the other, bump both dates.
*/

const h2 = "display mt-14 text-[1.75rem] leading-tight text-cream";
const p = "mt-4 text-base leading-relaxed text-cream/85";
const a = "text-olive underline underline-offset-2 hover:text-deep";
const mail = (
  <a href={`mailto:${site.email}`} className={`${a} [overflow-wrap:anywhere]`}>
    {site.email}
  </a>
);
const anspdcp = (
  <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className={a}>
    dataprotection.ro
  </a>
);

function PrivacyEn() {
  return (
    <>
      <p className="eyebrow mb-4">Privacy</p>
      <h1 className="display text-[clamp(2.5rem,1.4rem+3.2vw,3.75rem)]">
        The short, honest <span className="display-italic text-rose-2">version.</span>
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        This is a small, one-person site. I don&apos;t want your data, I want to paint your shoes. Here&apos;s exactly
        what happens when you visit.
      </p>

      <h2 className={h2}>Who runs this site</h2>
      <p className={p}>
        Me, Iasmina Silaschi, in Romania. If anything on this page worries you, or you want to use one of your rights
        below, write to me at {mail}.
      </p>

      <h2 className={h2}>No accounts, no database</h2>
      <p className={p}>
        There are no accounts and no logins here, and there is no database: the site doesn&apos;t keep what you type.
        No advertising or tracking cookies either. The fonts are served from this site, so your browser doesn&apos;t
        contact Google to load them.
      </p>
      <p className={p}>
        The only cookie is a tiny one that remembers which language you picked (English or Romanian), so the site
        opens in it next time. It holds just &ldquo;en&rdquo; or &ldquo;ro&rdquo;, nothing about you, and expires after
        a year.
      </p>
      <p className={p}>
        Like any website, the site is delivered by a hosting company (Vercel), which briefly handles technical details
        such as your IP address so it can send you the pages and keep the site safe.
      </p>

      <h2 className={h2}>The contact form</h2>
      <p className={p}>
        While you type, your answers are saved as a draft in your own browser (localStorage), so you can come back and
        finish later. That draft never leaves your device on its own. It&apos;s deleted when you send the form, after
        30 days without changes, or whenever you press &ldquo;clear draft&rdquo;.
      </p>
      <p className={p}>
        When you press send, your message travels from your browser to this site&apos;s server (run by Vercel), which
        hands it to Resend, an email delivery service, and Resend delivers it to my email inbox. What&apos;s sent: your
        name, your email and/or Instagram handle, what you&apos;d love painted, your idea, the inspiration link if you
        added one, the project you came from if you used a &ldquo;dream up one like this&rdquo; link, and the language
        of the page, so I can reply in it. Nothing is saved on the site itself. Resend keeps a delivery log of sent
        emails for a limited time, as email services do.
      </p>
      <p className={p}>
        Why: so I can read your idea and write back to you. That&apos;s the only thing I use it for. To keep spam out,
        the server briefly remembers how many messages came from an IP address in the last hour; that count lives only
        in memory and is never stored or linked to your message.
      </p>

      <h2 className={h2}>Visitor counts (Vercel Web Analytics)</h2>
      <p className={p}>
        I use Vercel Web Analytics to see how many people visit and which pages they like. It uses no cookies and
        doesn&apos;t build a profile of you. It looks at things like the page, the site you came from, your browser,
        device type and country, and I only ever see totals, never a person.
      </p>

      <h2 className={h2}>When you write to me</h2>
      <p className={p}>
        Whether you use the form, email me or send a DM, I get what you choose to send: your name, how to reach you,
        your idea and any photos or links. I use it only to reply and, if we make something together, to plan and
        paint it. I never sell it or share it, except what&apos;s truly needed to make your piece happen (for example,
        a courier needs an address).
      </p>
      <p className={p}>
        How long I keep it: until our conversation is done (and, if I painted something for you, a while after, in
        case it ever needs a touch-up). Ask me any time and I&apos;ll delete it sooner. Instagram, TikTok, Resend and
        your email provider are their own services, with their own privacy rules.
      </p>

      <h2 className={h2}>Your rights</h2>
      <p className={p}>
        Under the GDPR you can ask me what I have about you, get a copy, correct it, have it deleted, limit or object
        to how I use it, and take it elsewhere. Just email me, no special form needed. I&apos;ll answer within a month,
        usually much sooner.
      </p>
      <p className={p}>
        If you think I&apos;ve handled your data badly, you can also complain to the Romanian data protection
        authority, ANSPDCP ({anspdcp}). I&apos;d love the chance to fix it first, though.
      </p>

      <p className="mt-14 border-t border-line pt-6 text-sm text-muted">
        Last updated: 22 November 2026. If anything here changes, this page changes first.
      </p>
    </>
  );
}

function PrivacyRo() {
  return (
    <>
      <p className="eyebrow mb-4">Confidențialitate</p>
      <h1 className="display text-[clamp(2.5rem,1.4rem+3.2vw,3.75rem)]">
        Varianta scurtă și <span className="display-italic text-rose-2">sinceră.</span>
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        E un site mic, făcut de un singur om. Nu-mi trebuie datele tale, vreau să-ți pictez pantofii. Iată exact ce se
        întâmplă când intri aici.
      </p>

      <h2 className={h2}>Cine se ocupă de site</h2>
      <p className={p}>
        Eu, Iasmina Silaschi, din România. Dacă ceva de pe pagina asta te îngrijorează sau vrei să-ți exerciți unul
        dintre drepturile de mai jos, scrie-mi la {mail}.
      </p>

      <h2 className={h2}>Fără conturi, fără bază de date</h2>
      <p className={p}>
        Aici nu există conturi, nici autentificare și nici bază de date: site-ul nu păstrează ce scrii. Nici cookie-uri
        de reclamă sau de urmărire. Fonturile sunt servite chiar de site, așa că browserul tău nu contactează Google ca
        să le încarce.
      </p>
      <p className={p}>
        Singurul cookie e unul mititel, care ține minte ce limbă ai ales (română sau engleză), ca site-ul să se
        deschidă în ea data viitoare. Conține doar &bdquo;ro&rdquo; sau &bdquo;en&rdquo;, nimic despre tine, și expiră
        după un an.
      </p>
      <p className={p}>
        Ca orice site, și acesta e livrat de o firmă de găzduire (Vercel), care se ocupă pentru scurt timp de detalii
        tehnice, cum ar fi adresa ta IP, ca să-ți poată trimite paginile și să țină site-ul în siguranță.
      </p>

      <h2 className={h2}>Formularul de contact</h2>
      <p className={p}>
        Cât timp scrii, răspunsurile tale se salvează ca ciornă în propriul tău browser (localStorage), ca să poți
        reveni și termina mai târziu. Ciorna nu pleacă niciodată singură de pe dispozitivul tău. Se șterge când trimiți
        formularul, după 30 de zile fără modificări sau oricând apeși &bdquo;șterge ciorna&rdquo;.
      </p>
      <p className={p}>
        Când apeși pe trimite, mesajul tău pleacă din browser către serverul acestui site (găzduit de Vercel), care îl
        predă către Resend, un serviciu de livrare a emailurilor, iar Resend îl livrează în inboxul meu. Ce se trimite:
        numele tău, emailul și/sau contul de Instagram, ce ți-ar plăcea să pictez, ideea ta, linkul de inspirație dacă
        ai adăugat unul, proiectul de la care ai venit dacă ai folosit un link &bdquo;vreau ceva în stilul ăsta&rdquo;
        și limba paginii, ca să-ți pot răspunde în ea. Nimic nu se salvează pe site. Resend păstrează pentru o perioadă
        limitată un jurnal al emailurilor trimise, cum fac serviciile de email.
      </p>
      <p className={p}>
        De ce: ca să-ți pot citi ideea și să-ți răspund. Doar la asta le folosesc. Ca să țină spamul departe, serverul
        ține minte pentru scurt timp câte mesaje au venit de la o adresă IP în ultima oră; numărul ăsta există doar în
        memorie, nu e salvat nicăieri și nu e legat de mesajul tău.
      </p>

      <h2 className={h2}>Numărul de vizitatori (Vercel Web Analytics)</h2>
      <p className={p}>
        Folosesc Vercel Web Analytics ca să văd câți oameni intră pe site și ce pagini le plac. Nu folosește cookie-uri
        și nu-ți construiește un profil. Se uită la lucruri precum pagina, site-ul de pe care ai venit, browserul, tipul
        de dispozitiv și țara, iar eu văd doar totaluri, niciodată o persoană.
      </p>

      <h2 className={h2}>Când îmi scrii</h2>
      <p className={p}>
        Fie că folosești formularul, îmi trimiți un email sau un mesaj pe Instagram, primesc ce alegi tu să trimiți:
        numele tău, cum te pot contacta, ideea ta și eventuale poze sau linkuri. Le folosesc doar ca să-ți răspund și,
        dacă facem ceva împreună, ca să-l plănuiesc și să-l pictez. Nu le vând și nu le dau nimănui, în afară de ce e
        cu adevărat necesar ca piesa ta să ajungă la tine (de exemplu, curierul are nevoie de o adresă).
      </p>
      <p className={p}>
        Cât timp le păstrez: până se termină conversația noastră (iar dacă am pictat ceva pentru tine, încă o vreme
        după, în caz că are nevoie de o retușare). Cere-mi oricând și le șterg mai devreme. Instagram, TikTok, Resend și
        furnizorul tău de email sunt servicii separate, cu propriile reguli de confidențialitate.
      </p>

      <h2 className={h2}>Drepturile tale</h2>
      <p className={p}>
        Conform GDPR, poți să mă întrebi ce date am despre tine, să primești o copie, să le corectezi, să le ștergi, să
        limitezi felul în care le folosesc sau să te opui, și să le duci în altă parte. Scrie-mi pur și simplu pe email,
        nu e nevoie de niciun formular special. Îți răspund în cel mult o lună, de obicei mult mai repede.
      </p>
      <p className={p}>
        Dacă crezi că nu am avut grijă de datele tale cum trebuie, poți depune și o plângere la autoritatea română
        pentru protecția datelor, ANSPDCP ({anspdcp}). Totuși, mi-ar plăcea să am întâi ocazia să repar lucrurile.
      </p>

      <p className="mt-14 border-t border-line pt-6 text-sm text-muted">
        Ultima actualizare: 22 noiembrie 2026. Dacă se schimbă ceva, pagina asta se schimbă prima.
      </p>
    </>
  );
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <div className="gutter mx-auto max-w-3xl pt-36 pb-20 max-sm:[--gutter:1.25rem] lg:[--gutter:1.5rem]">
      {lang === "ro" ? <PrivacyRo /> : <PrivacyEn />}
      <p className="mt-3">
        <Link href={localePath(lang, "/contact")} className={`${a} inline-flex min-h-11 items-center`}>
          {lang === "ro" ? "← Înapoi la contact" : "← Back to contact"}
        </Link>
      </p>
    </div>
  );
}
