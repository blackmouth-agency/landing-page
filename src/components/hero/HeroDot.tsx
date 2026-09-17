import { forwardRef } from "react";
import type { HeroHotspot } from "../../data/heroHotspots";

interface HeroDotProps {
  hotspot: HeroHotspot;
  /** Punto a usar (desktop o móvil), en % del hero */
  point: { x: number; y: number };
  /** Oculto (móvil, tras el tour) */
  hidden?: boolean;
  /** En móvil el hero no es interactivo: el punto es solo una marca */
  interactive?: boolean;
  onClick: () => void;
}

/**
 * Punto de interés. Es un botón con un área táctil de 44px alrededor del punto visible:
 * en táctil el usuario lo toca para llevar el lente hasta ahí.
 */
const HeroDot = forwardRef<HTMLButtonElement, HeroDotProps>(function HeroDot(
  { hotspot, point, hidden = false, interactive = true, onClick },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={`Ver: ${hotspot.title}`}
      tabIndex={interactive ? 0 : -1}
      className={`group/dot absolute z-10 -mt-[22px] -ml-[22px] flex h-11 w-11 items-center justify-center rounded-full transition-[opacity,transform] duration-200 ease-in-out ${
        interactive ? "cursor-pointer" : "pointer-events-none"
      }`}
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
        ...(hidden ? { opacity: 0 } : null),
      }}
    >
      <span className="h-[11px] w-[11px] rounded-full bg-bm-orange shadow-[0_0_0_5px_rgba(243,146,0,0.16)] transition-[box-shadow] duration-200 group-hover/dot:shadow-[0_0_0_8px_rgba(243,146,0,0.24)]" />
    </button>
  );
});

export default HeroDot;
