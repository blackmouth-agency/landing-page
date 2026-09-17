import type { AnchorHTMLAttributes } from "react";

type NavLinkVariant = "desktop" | "mobile";

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: NavLinkVariant;
}

const variantClasses: Record<NavLinkVariant, string> = {
  desktop: "nav-link text-[0.68rem] tracking-[0.2em] text-bm-black",
  mobile: "text-sm tracking-[0.15em] text-white",
};

export default function NavLink({
  variant = "desktop",
  className = "",
  children,
  ...anchorProps
}: NavLinkProps) {
  return (
    <a
      className={`font-bold uppercase ${variantClasses[variant]} ${className}`.trim()}
      {...anchorProps}
    >
      {children}
    </a>
  );
}
