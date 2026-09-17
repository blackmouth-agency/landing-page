import { forwardRef } from "react";
import type { HeroHotspot } from "../../data/heroHotspots";

interface HeroMessageProps {
  hotspot: HeroHotspot;
  /**
   * `anchored` (desktop): el bloque va dentro de la capa enmascarada, junto a su hotspot.
   * `caption` (táctil): el bloque va fuera de la máscara, apilado en el contenedor que sigue al lente.
   */
  variant?: "anchored" | "caption";
}

const HeroMessage = forwardRef<HTMLDivElement, HeroMessageProps>(
  function HeroMessage({ hotspot, variant = "anchored" }, ref) {
    const isCaption = variant === "caption";
    return (
      <div
        ref={ref}
        className={`pointer-events-none absolute opacity-0 transition-opacity duration-200 ease-in-out ${
          isCaption
            ? "inset-x-0 top-0 flex justify-center group-data-[side=above]/cap:-translate-y-full"
            : `-translate-x-[2px] -translate-y-[0.62em] ${hotspot.widthClass}`
        }`}
        style={
          isCaption
            ? undefined
            : { left: `${hotspot.x}%`, top: `${hotspot.y}%` }
        }
      >
        <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
          <hotspot.icon
            className="h-8 w-8 shrink-0 self-center text-bm-orange"
            strokeWidth={2}
          />
          <div className="flex flex-col items-start">
            <strong className="text-bm-msg-title block uppercase text-bm-orange">
              {hotspot.title}
            </strong>
            <em className="text-bm-msg-body block text-white not-italic">
              {hotspot.description}
            </em>
          </div>
        </div>
      </div>
    );
  },
);

export default HeroMessage;
