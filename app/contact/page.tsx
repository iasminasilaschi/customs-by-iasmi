import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Tag } from "@/components/ui/Tag";
import { site } from "@/data/site";
import type { ProjectType } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a custom sneaker commission, ask about graduation caps or a tiny website — or just say hi. Email, Instagram, TikTok, or the form.",
};

const validTypes: ProjectType[] = ["sneakers", "cap", "nails", "web", "collab", "other"];

const channels = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    note: "best for commissions & moodboards",
  },
  {
    label: "Instagram",
    value: site.instagramHandle,
    href: site.instagram,
    note: "DMs open, process reels live here",
  },
  {
    label: "TikTok",
    value: site.tiktokHandle,
    href: site.tiktok,
    note: "process clips & behind the scenes",
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
        lede="A commission, a question, a collaboration, a hello — all welcome. I read everything myself and reply as fast as paint-drying allows."
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

          <div className="glass grain rounded-blob p-6">
            <div className="flex items-center gap-2">
              <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-rose" />
              <p className="text-sm font-medium text-cream">Availability</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {site.monthlySlots} commission slots per month. Current lead
              time: {site.leadTimeWeeks} weeks (placeholder). Graduation caps
              for September are almost booked.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Tag tone="rose">sneakers — open</Tag>
              <Tag tone="lilac">caps — 2 slots reserved</Tag>
              <Tag tone="gold">web — by conversation</Tag>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="grain rounded-blob border border-line bg-coal p-6 sm:p-8">
          <h2 className="display text-2xl text-cream">Or start right here</h2>
          <p className="mt-2 mb-7 text-sm text-muted">
            The same smart form as the Design Lab — it adapts to what you&apos;re
            asking for.
          </p>
          <InquiryForm defaultType={defaultType} compact />
        </div>
      </div>
    </div>
  );
}
