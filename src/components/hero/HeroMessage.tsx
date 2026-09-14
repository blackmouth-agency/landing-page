import { forwardRef } from "react";
import type { HeroHotspot } from "../../data/heroHotspots";

interface HeroMessageProps {
  hotspot: HeroHotspot;
}

const HeroMessage = forwardRef<HTMLDivElement, HeroMessageProps>(function HeroMessage(
  { hotspot },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute -translate-x-[2px] -translate-y-[0.62em] opacity-0 transition-opacity duration-200 ease-in-out ${hotspot.widthClass}`}
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
    >
      <div className="flex items-center gap-3 rounded-lg bg-black/60 px-3 py-2 backdrop-blur-sm">
        <hotspot.icon className="h-8 w-8 shrink-0 self-center text-bm-orange" strokeWidth={2} />
        <div className="flex flex-col items-start">
          <strong className="text-bm-msg-title block uppercase text-bm-orange">
            {hotspot.title}
          </strong>
          <em className="text-bm-msg-body block text-white not-italic">{hotspot.description}</em>
        </div>
      </div>
    </div>
  );
});

export default HeroMessage;
