import { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import { navLinks } from "../../data/navLinks";
import NavLink from "../ui/NavLink";
import MenuToggle from "../ui/MenuToggle";
import MobileMenu from "./MobileMenu";

const MOBILE_NAV_ID = "mobile-nav";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between gap-5 bg-black/24 px-5 py-4 backdrop-blur-md sm:px-8">
        <a href="#inicio" aria-label="BLACKMOUTH inicio">
          <img src={logo} alt="BLACKMOUTH" className="h-12 w-auto md:h-16" />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <MenuToggle open={open} onClick={() => setOpen((v) => !v)} controls={MOBILE_NAV_ID} />
      </header>

      <MobileMenu id={MOBILE_NAV_ID} open={open} links={navLinks} onClose={() => setOpen(false)} />
    </>
  );
}
