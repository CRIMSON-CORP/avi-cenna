import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "./icons";

type Variant = "primary" | "outline" | "ghost" | "invert";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-500 text-white shadow-soft hover:bg-accent-600 hover:shadow-lift active:bg-accent-700",
  outline:
    "border border-brand-300 bg-surface/70 text-ink backdrop-blur hover:border-brand-500 hover:bg-surface hover:shadow-soft",
  ghost: "text-ink hover:bg-brand-50",
  invert:
    "bg-white text-brand-900 shadow-soft hover:bg-brand-50 hover:shadow-lift",
};

const sizes: Record<Size, string> = {
  sm: "h-10 gap-1.5 px-4 text-[0.83rem]",
  md: "h-12 gap-2 px-6 text-[0.9rem]",
};

/**
 * The class recipe on its own, for the handful of controls that wear a button
 * but cannot BE one of these — the hero CTA that opens the tour dialog is a
 * real <button>, not a link, so it takes the classes and skips the component.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    "focus-ring group/btn inline-flex items-center justify-center rounded-pill font-semibold",
    "transition-[background-color,border-color,box-shadow,transform] duration-base ease-out-expo",
    "hover:-translate-y-0.5 active:translate-y-0",
    variants[variant],
    sizes[size],
    className,
  );
}

/** Renders an external URL as a plain anchor, everything else through Link. */
function isExternal(href: string) {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");
}

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
} & Omit<React.ComponentProps<"a">, "href" | "children" | "className">) {
  const classes = buttonClasses({ variant, size, className });

  const inner = (
    <>
      {children}
      {arrow && (
        <ArrowIcon className="h-4 w-4 transition-transform duration-base ease-out-expo group-hover/btn:translate-x-1" />
      )}
    </>
  );

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {inner}
    </Link>
  );
}
