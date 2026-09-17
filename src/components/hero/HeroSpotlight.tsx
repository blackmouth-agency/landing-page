import { forwardRef, useId, type PointerEventHandler } from "react";

interface HeroSpotlightProps {
  isDragging: boolean;
  /** Estado final en móvil: el aro enmarca los titulares, sin texto en arco ni animación ambiental */
  settled?: boolean;
  /** En móvil el lente se mueve solo y no se puede arrastrar */
  interactive?: boolean;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
}

const CORNER_CLASSES = [
  "top-0 left-0 border-t-[3px] border-l-[3px]",
  "top-0 right-0 border-t-[3px] border-r-[3px]",
  "bottom-0 left-0 border-b-[3px] border-l-[3px]",
  "bottom-0 right-0 border-b-[3px] border-r-[3px]",
];

const HeroSpotlight = forwardRef<HTMLDivElement, HeroSpotlightProps>(
  function HeroSpotlight(
    { isDragging, settled = false, interactive = true, onPointerDown },
    ref,
  ) {
    const arcId = useId();

    return (
      <div
        ref={ref}
        onPointerDown={interactive ? onPointerDown : undefined}
        className={`group absolute top-0 left-0 rounded-full transition-[margin,height,width] duration-300 ease-out ${
          interactive ? "" : "pointer-events-none"
        } ${
          isDragging
            ? "-mt-[170px] -ml-[170px] h-[340px] w-[340px] cursor-grabbing sm:-mt-[256px] sm:-ml-[256px] sm:h-[512px] sm:w-[512px]"
            : "-mt-[110px] -ml-[110px] h-[220px] w-[220px] cursor-grab sm:-mt-[160px] sm:-ml-[160px] sm:h-[320px] sm:w-[320px]"
        }`}
      >
        <div
          className={`absolute inset-0 rounded-full border-[2.5px] transition-colors duration-300 ease-in-out ${
            isDragging || settled
              ? "border-white/90"
              : "animate-bm-breathe border-white/62 group-hover:border-white/90"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-0 rounded-full border-2 border-white/50 transition-opacity duration-300 ${
            isDragging ? "" : "animate-bm-drift"
          } ${settled ? "opacity-0" : ""}`}
        />

        <svg
          viewBox="0 0 200 200"
          className={`text-bm-spot pointer-events-none absolute inset-0 h-full w-full text-white transition-opacity duration-200 ease-in-out ${
            isDragging || settled ? "opacity-0" : "opacity-100"
          }`}
        >
          <defs>
            <path id={arcId} d="M 26 100 A 74 74 0 0 1 174 100" fill="none" />
          </defs>
          <text
            fill="currentColor"
            style={{ filter: "drop-shadow(0 1px 14px rgba(0,0,0,0.45))" }}
            fontSize="16px"
            fontWeight="var(--text-bm-spot--font-weight)"
          >
            <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
              No todo es lo que parece
            </textPath>
          </text>
        </svg>

        <div
          className={`pointer-events-none absolute -inset-[26px] transition-opacity duration-250 ease-in-out ${
            isDragging ? "opacity-0" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {CORNER_CLASSES.map((cornerClass) => (
            <i
              key={cornerClass}
              className={`absolute h-4 w-4 border-white/70 ${cornerClass}`}
            />
          ))}
        </div>

        <div
          className={`pointer-events-none absolute bottom-full left-1/2 flex -translate-x-1/2 -translate-y-[22px] items-center gap-2 border border-white/16 bg-[rgba(10,10,10,0.78)] px-[11px] py-1.5 whitespace-nowrap transition-opacity duration-250 ease-in-out ${
            isDragging ? "opacity-0" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <span className="h-[5px] w-[5px] rounded-full bg-bm-orange" />
          <span className="text-bm-label text-white uppercase">
            Arrastra y descubre
          </span>
        </div>
      </div>
    );
  },
);

export default HeroSpotlight;
