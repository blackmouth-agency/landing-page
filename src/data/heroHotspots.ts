import { Drama, Lightbulb, Handshake, type LucideIcon } from "lucide-react";

export interface HeroHotspot {
  /** Posición horizontal, en % del ancho del hero */
  x: number;
  /** Posición vertical, en % del alto del hero */
  y: number;
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
    title: "Sin careta",
    description: "somos nosotros",
    icon: Drama,
    widthClass: "w-[250px]",
  },
  {
    x: 74,
    y: 42,
    title: "El set completo",
    description: "con las luces a la vista",
    icon: Lightbulb,
    widthClass: "w-[min(230px,22vw)]",
  },
  {
    x: 64.5,
    y: 60,
    title: "Sin trucos",
    description: "las mismas personas que te van a atender",
    icon: Handshake,
    widthClass: "w-[260px]",
  },
];
