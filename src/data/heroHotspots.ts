export interface HeroHotspot {
  id: string;
  label: string;
  text: string;
  top: string;
  left: string;
}

export const heroHotspots: HeroHotspot[] = [
  { id: "hot1", label: "Sin careta", text: "Somos nosotros.", left: "15%", top: "30%" },
  { id: "hot2", label: "El set completo", text: "Con las luces a la vista.", left: "46%", top: "20%" },
  { id: "hot3", label: "Sin trucos", text: "Las mismas personas que te van a atender.", left: "75%", top: "38%" },
];
