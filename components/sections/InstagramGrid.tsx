import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { instagramPosts } from "@/data/instagram";
import { site } from "@/data/site";

/** Hand-picked real Instagram posts — hidden until there is at least one. */
export function InstagramGrid() {
  if (instagramPosts.length === 0) return null;
  return (
    <section className="mx-auto max-w-[90rem] px-4 py-24 sm:px-6 md:py-32 lg:px-12 xl:px-20">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="On Instagram"
            title={site.instagramHandle}
            lede="Finished pieces, graduation days and the whole process, from sketch to sealed."
          />
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-olive hover:underline"
          >
            Follow along →
          </a>
        </div>
      </Reveal>
      <ul className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {instagramPosts.map((post, i) => (
          <li key={post.url}>
            <Reveal delay={i * 0.06}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                aria-label={`${post.kind === "reel" ? "Reel" : "Post"} on Instagram: ${post.caption}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-line shadow-soft">
                  <Photo
                    photo={post.image}
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-deep/55 px-2.5 py-1 text-[0.78rem] uppercase tracking-widest text-paper/90 backdrop-blur-sm">
                    {post.kind === "reel" ? "▶ reel" : "post"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-snug text-muted transition-colors group-hover:text-deep">
                  {post.caption}
                </p>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
