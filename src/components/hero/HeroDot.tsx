import { forwardRef } from "react";
import type { HeroHotspot } from "../../data/heroHotspots";

interface HeroDotProps {
  hotspot: HeroHotspot;
}

const HeroDot = forwardRef<HTMLDivElement, HeroDotProps>(function HeroDot(
  { hotspot },
  ref,
) {
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute -mt-[5.5px] -ml-[5.5px] h-[11px] w-[11px] rounded-full bg-bm-orange shadow-[0_0_0_5px_rgba(243,146,0,0.16)] transition-[opacity,transform] duration-200 ease-in-out"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
    />
  );
});

export default HeroDot;
