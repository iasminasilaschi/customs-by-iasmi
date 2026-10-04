import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { site } from "@/data/site";
import type { ProjectType } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a custom sneaker or graduation cap commission, or just say hi. Send me a DM on Instagram, write an email, or use the short form.",
};

const validTypes: ProjectType[] = ["sneakers", "cap", "collab", "other"];

const channels = [
  {
    label: "Instagram",
    value: site.instagramHandle,
    href: site.instagram,
    note: "DMs open, you can order here too",
  },
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    note: "for longer ideas and moodboards",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const defaultType = validTypes.includes(type as ProjectType)
    ? (type as ProjectType)
    : "sneakers";

  return (
    <div className="mx-auto max-w-[90rem] px-5 pt-36 pb-20 sm:px-6 lg:px-12 xl:px-20">
      <SectionHeading
        eyebrow="Contact"
        title={
          <>
            Tell me what refuses to{" "}
            <span className="display-italic text-rose-2">leave your brain.</span>
          </>
        }
        lede="The easiest way to order is to send me a DM on Instagram or write an email. Prefer something guided? The short form here asks one small thing at a time."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Channels */}
        <div className="space-y-4">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group block rounded-blob border border-line bg-coal p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/40"
            >
              <p className="eyebrow">{c.label}</p>
              <p className="mt-2 text-lg text-cream transition-colors group-hover:text-rose-2">
                {c.value}
              </p>
              <p className="mt-1 text-sm text-muted">{c.note}</p>
            </a>
          ))}
        </div>

        {/* Form */}
        <div className="grain rounded-blob border border-line bg-coal p-6 sm:p-8">
          <h2 className="display text-2xl text-cream">Or start right here</h2>
          <p className="mt-2 mb-7 text-sm text-muted">
            Four quick steps. Your answers are saved on this device, so you can
            come back and finish later.
          </p>
          <InquiryForm defaultType={defaultType} typeFromLink={validTypes.includes(type as ProjectType)} compact />
        </div>
      </div>
    </div>
  );
}
