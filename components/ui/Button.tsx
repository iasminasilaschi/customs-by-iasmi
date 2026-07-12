import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 ease-out focus-visible:outline-olive disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-olive text-paper shadow-[0_10px_30px_-14px_rgba(47,58,47,0.7)] hover:bg-deep hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "border border-olive/35 text-deep hover:border-olive hover:bg-olive/5 active:translate-y-0",
  ghost: "text-brown hover:text-olive",
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
