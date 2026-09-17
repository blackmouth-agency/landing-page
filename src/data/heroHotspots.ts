import { Drama, Lightbulb, Handshake, type LucideIcon } from "lucide-react";

export interface HeroHotspot {
  /** Posición horizontal, en % del ancho del hero */
  x: number;
  /** Posición vertical, en % del alto del hero */
  y: number;
  /** Posición en móvil (formato vertical): la foto recorta distinto y el titular ocupa la mitad inferior */
  mobile: { x: number; y: number };
  title: string;
  description: string;
  icon: LucideIcon;
  /** Ancho del bloque de mensaje (clases Tailwind arbitrarias) */
  widthClass: string;
}

export const heroHotspots: HeroHotspot[] = [
  {
    x: 58,
    y: 26,
    mobile: { x: 72, y: 16 },
    title: "Sin careta",
    description: "somos nosotros",
    icon: Drama,
    widthClass: "w-[250px]",
  },
  {
    x: 74,
    y: 42,
    mobile: { x: 26, y: 30 },
    title: "El set completo",
    description: "con las luces a la vista",
    icon: Lightbulb,
    widthClass: "w-[min(230px,22vw)]",
  },
  {
    x: 64.5,
    y: 60,
    mobile: { x: 80, y: 36 },
    title: "Sin trucos",
    description: "las mismas personas que te van a atender",
    icon: Handshake,
    widthClass: "w-[260px]",
  },
];
