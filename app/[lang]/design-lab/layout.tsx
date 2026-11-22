import { notFound } from "next/navigation";

/** The Design Lab is a private tool, in English only: /ro/design-lab doesn't exist. */
export default async function DesignLabLayout({ children, params }: LayoutProps<"/[lang]/design-lab">) {
  const { lang } = await params;
  if (lang !== "en") notFound();
  return children;
}
