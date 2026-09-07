import logo from "../../assets/images/logo.png";

const links = [
  { label: "El problema", href: "#problema" },
  { label: "La solución", href: "#solucion" },
  { label: "Qué incluye", href: "#incluye" },
  { label: "Servicios", href: "#servicios" },
  { label: "Equipo", href: "#equipo" },
  { label: "Hablemos", href: "#hablemos" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#inicio">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto"
          />
        </a>
        
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm transition-opacity hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}