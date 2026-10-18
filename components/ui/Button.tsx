import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "vibe" | "vibe-outline";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 ease-out disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-olive text-paper shadow-[0_10px_30px_-14px_rgba(47,58,47,0.7)] hover:bg-deep hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-olive",
  outline:
    "border border-olive/35 text-deep hover:border-olive hover:bg-olive/5 active:translate-y-0 focus-visible:outline-olive",
  ghost: "text-brown hover:text-olive focus-visible:outline-olive",
  // follow the homepage hero's current pair (see the vibe tokens in globals.css)
  vibe:
    "bg-(--vibe-accent) text-(--vibe-accent-ink) shadow-[0_12px_30px_-14px_var(--vibe-shade)] hover:bg-[color-mix(in_oklab,var(--vibe-accent),var(--vibe-ink)_22%)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-(--vibe-ink)",
  "vibe-outline":
    "border border-(--vibe-ink)/35 text-(--vibe-ink) hover:border-(--vibe-ink) hover:bg-(--vibe-tint) active:translate-y-0 focus-visible:outline-(--vibe-ink)",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-[0.95rem] lg:text-base",
  lg: "px-8 py-4 text-base lg:px-9 lg:text-[1.05rem]",
};

interface ButtonProps {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
