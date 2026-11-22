import { notFound } from "next/navigation";

/**
 * Any URL that matches no page lands here and gets the site's own 404
 * (app/[lang]/not-found.tsx), in the right language and inside the layout.
 */
export default function Missing() {
  notFound();
}
