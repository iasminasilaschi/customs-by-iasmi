import type { Testimonial } from "@/data/testimonials";

/** Honest placeholder testimonial — always shows the "sample" badge. */
export function TestimonialCard({ t, tilt = 0 }: { t: Testimonial; tilt?: number }) {
  return (
    <figure
      className="glass grain relative rounded-blob p-6"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <span className="absolute -top-2.5 right-5 rounded-full bg-gold/90 px-2.5 py-0.5 text-[0.78rem] font-medium uppercase tracking-widest text-ink">
        sample — real stories coming soon
      </span>
      <blockquote className="display-italic text-lg leading-snug text-cream/90">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-4 text-sm text-muted">
        {t.name} · <span className="text-lilac">{t.project}</span>
      </figcaption>
    </figure>
  );
}
