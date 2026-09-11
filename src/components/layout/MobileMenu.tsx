import NavLink from "../ui/NavLink";
import type { NavLinkItem } from "../../data/navLinks";

interface MobileMenuProps {
  id: string;
  open: boolean;
  links: NavLinkItem[];
  onClose: () => void;
}

export default function MobileMenu({ id, open, links, onClose }: MobileMenuProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <nav
        id={id}
        className={`fixed inset-y-0 right-0 z-40 flex w-[78vw] max-w-xs flex-col items-start justify-center gap-7 bg-bm-g900 px-9 transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {links.map((link) => (
          <NavLink key={link.href} variant="mobile" href={link.href} onClick={onClose}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
