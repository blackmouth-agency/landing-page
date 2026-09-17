import { useEffect, useState } from "react";
import logo from "../../assets/images/logo_black.png";
import { navLinks } from "../../data/navLinks";
import NavLink from "../ui/NavLink";
import MenuToggle from "../ui/MenuToggle";
import BackToTop from "../ui/BackToTop";
import MobileMenu from "./MobileMenu";
import { useSectionInView } from "../../hooks/useSectionInView";

const MOBILE_NAV_ID = "mobile-nav";
const HERO_ID = "inicio";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const heroInView = useSectionInView(HERO_ID);
  const visible = heroInView || open;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 flex w-full items-center justify-between gap-5 bg-bm-orange px-5 py-4 transition-transform duration-300 ease-out sm:px-8 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <a href={`#${HERO_ID}`} aria-label="BLACKMOUTH inicio">
          <img src={logo} alt="BLACKMOUTH" className="h-12 w-auto md:h-16" />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <MenuToggle
          open={open}
          onClick={() => setOpen((v) => !v)}
          controls={MOBILE_NAV_ID}
        />
      </header>

      {/* Reserva en el flujo el alto del header fijo (logo h-12/h-16 + py-4) para que el hero empiece debajo */}
      <div aria-hidden="true" className="h-20 bg-bm-orange md:h-24" />

      <MobileMenu
        id={MOBILE_NAV_ID}
        open={open}
        links={navLinks}
        onClose={() => setOpen(false)}
      />

      <BackToTop visible={!visible} />
    </>
  );
}
