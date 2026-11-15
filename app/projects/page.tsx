import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Custom hand-painted sneakers and graduation caps — the projects from Customs by Iasmi.",
  path: "/projects",
});

export default function ArchivePage() {
  return (
    <div className="gutter mx-auto max-w-[90rem] pt-36 pb-20 max-sm:[--gutter:1.25rem]">
      <SectionHeading
        as="h1"
        wide
        eyebrow="My projects"
        title={
          <>
            Projects so far —{" "}
            <span className="display-italic text-rose-2">and counting.</span>
          </>
        }
        lede="Sneakers and graduation caps — everything I've actually made, with the process behind it."
      />
      <div className="mt-16 lg:mt-20">
        <ProjectsGrid />
      </div>
    </div>
  );
}
