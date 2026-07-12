import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Large, calm editorial card: a soft warm panel with an optional image band,
 * eyebrow, title, description and a quiet link. Shared by the featured and
 * "beyond sneakers" sections so the homepage reads as one system.
 */
export function EditorialCard({
  href,
  media,
  eyebrow,
  title,
  description,
  cta,
  className,
}: {
  href: string;
  media?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title: string;
  description: string;
  cta?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group block overflow-hidden rounded-blob border border-line bg-cream-soft shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      {media && <div className="overflow-hidden">{media}</div>}
      <div className="p-7 sm:p-8">
        {eyebrow && <div className="mb-3 flex flex-wrap items-center gap-2">{eyebrow}</div>}
        <h3 className="display text-2xl text-cream transition-colors group-hover:text-olive sm:text-[1.7rem]">
          {title}
        </h3>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{description}</p>
        {cta && (
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-olive">
            {cta}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        )}
      </div>
    </Link>
  );
}
