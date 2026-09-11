import { forwardRef } from "react";
import type { HeroHotspot } from "../../data/heroHotspots";

interface HeroHotspotMarkerProps {
  hotspot: HeroHotspot;
  /** Static markers (reduced motion) render on, always visible, no hover tracking. */
  active?: boolean;
}

const HeroHotspotMarker = forwardRef<HTMLDivElement, HeroHotspotMarkerProps>(
  ({ hotspot, active = false }, ref) => (
    <div
      ref={ref}
      className={`hero-hotspot ${active ? "hero-hotspot-on" : ""}`}
      style={{ left: hotspot.left, top: hotspot.top }}
    >
      <b className="block text-[0.62rem] font-black tracking-[0.2em] text-bm-orange uppercase">
        {hotspot.label}
      </b>
      <span className="mt-[3px] block max-w-[22ch] text-[0.92rem] font-semibold text-white [text-shadow:0_1px_12px_#000]">
        {hotspot.text}
      </span>
    </div>
  ),
);

HeroHotspotMarker.displayName = "HeroHotspotMarker";

export default HeroHotspotMarker;
