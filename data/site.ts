/**
 * Central site config. Contact details here still need confirming.
 */
export const site = {
  name: "iasmi.ro",
  tagline: "Wearable art, painted by hand.",
  email: "iasminasilaschi@gmail.com",
  instagram: "https://instagram.com/customsbyiasmi",
  instagramHandle: "@customsbyiasmi",
  tiktok: "https://tiktok.com/@iasminasilaschi",
  tiktokHandle: "@iasminasilaschi",
  location: "Romania · ships worldwide",
};

export const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/design-lab", label: "Design Lab" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/process", label: "How it works" },
  { href: "/design-lab", label: "Start a commission" },
] as const;
