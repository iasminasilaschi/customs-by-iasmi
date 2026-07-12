import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <p className="hand rotate-[-2deg] text-3xl text-lilac">oops — blank canvas</p>
      <h1 className="display mt-4 text-[clamp(2.5rem,1.5rem+3.4vw,4.25rem)]">
        This page isn&apos;t{" "}
        <span className="display-italic text-rose-2">painted yet.</span>
      </h1>
      <p className="mt-4 max-w-sm text-sm text-muted">
        Maybe it&apos;s on the roadmap, maybe the link drifted. Either way, the
        studio is this way:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href="/">Back home</Button>
        <Button href="/projects" variant="outline">
          Browse my projects
        </Button>
      </div>
    </div>
  );
}
