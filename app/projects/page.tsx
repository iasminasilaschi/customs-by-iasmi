import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Custom hand-painted sneakers, graduation caps, nail art, sketches, process logs and digital experiments — the growing body of projects from Customs by Iasmi.",
};

export default function ArchivePage() {
  return (
    <div className="mx-auto max-w-[90rem] px-5 pt-36 pb-20 sm:px-6 lg:px-12 xl:px-20">
      <SectionHeading
        wide
        eyebrow="My projects"
        title={
          <>
            Projects so far —{" "}
            <span className="display-italic text-rose-2">and counting.</span>
          </>
        }
        lede="Sneakers, caps, nail art, sketches and experiments. Currently filled with placeholder case studies that show how real projects will be documented: before/after, process, story."
      />
      <div className="mt-16 lg:mt-20">
        <ProjectsGrid />
      </div>
    </div>
  );
}
