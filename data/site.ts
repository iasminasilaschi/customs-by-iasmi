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
  location: "Romania",
};

/** Main pages. Labels come from the dictionaries (lib/dictionaries), by `key`. */
export const navLinks = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;
