import { useEffect, useRef, useState } from "react";
import heroReal from "../assets/images/hero1.jpg";
import heroPolished from "../assets/images/hero2.jpg";
import { heroHotspots } from "../data/heroHotspots";
import HeroHotspotMarker from "../components/ui/HeroHotspotMarker";

const DESKTOP_RADIUS = 245;
const TOUCH_RADIUS = 170;
const HOTSPOT_TRIGGER_MARGIN = 110;
const RADIUS_EASE = 0.14;
const TOUCH_SWEEP_MS = 5200;

export default function Hero() {
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const topImgRef = useRef<HTMLImageElement>(null);
  const hotspotRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const hero = heroRef.current;
    const stage = stageRef.current;
    const topImg = topImgRef.current;
    if (!hero || !stage || !topImg) return;

    const touch = matchMedia("(hover: none)").matches;
    let radius = 0;
    let targetRadius = 0;
    let rafId: number;

    const setHotspots = (x: number, y: number, stageRect: DOMRect) => {
      heroHotspots.forEach((h) => {
        const el = hotspotRefs.current[h.id];
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left - stageRect.left + r.width / 2;
        const cy = r.top - stageRect.top + r.height / 2;
        el.classList.toggle("hero-hotspot-on", Math.hypot(cx - x, cy - y) < radius + HOTSPOT_TRIGGER_MARGIN);
      });
    };

    const ease = () => {
      radius += (targetRadius - radius) * RADIUS_EASE;
      topImg.style.setProperty("--r", `${radius.toFixed(1)}px`);
      rafId = requestAnimationFrame(ease);
    };
    ease();

    if (touch) {
      let start: number | null = null;
      const sweep = (ts: number) => {
        if (start === null) start = ts;
        const p = ((ts - start) / TOUCH_SWEEP_MS) % 1;
        const rect = stage.getBoundingClientRect();
        const x = rect.width * (0.5 + 0.34 * Math.sin(p * Math.PI * 2));
        const y = rect.height * 0.42;
        topImg.style.setProperty("--mx", `${x}px`);
        topImg.style.setProperty("--my", `${y}px`);
        setHotspots(x, y, rect);
        rafId = requestAnimationFrame(sweep);
      };
      targetRadius = TOUCH_RADIUS;
      hero.classList.add("xraying");
      rafId = requestAnimationFrame(sweep);

      return () => cancelAnimationFrame(rafId);
    }

    const handleEnter = () => {
      targetRadius = DESKTOP_RADIUS;
      hero.classList.add("xraying");
    };
    const handleLeave = () => {
      targetRadius = 0;
      hero.classList.remove("xraying");
      heroHotspots.forEach((h) => hotspotRefs.current[h.id]?.classList.remove("hero-hotspot-on"));
    };
    const handleMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      topImg.style.setProperty("--mx", `${x}px`);
      topImg.style.setProperty("--my", `${y}px`);
      setHotspots(x, y, rect);
    };

    stage.addEventListener("pointerenter", handleEnter);
    stage.addEventListener("pointerleave", handleLeave);
    stage.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      stage.removeEventListener("pointerenter", handleEnter);
      stage.removeEventListener("pointerleave", handleLeave);
      stage.removeEventListener("pointermove", handleMove);
    };
  }, [reducedMotion]);

  return (
    <section ref={heroRef} id="inicio" className="hero relative h-svh min-h-[620px] overflow-hidden bg-black">
      <div ref={stageRef} className="absolute inset-0">
        <img
          src={heroReal}
          alt="El equipo de BlackMouth Agency grabando en el set real, con luces y chroma a la vista"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {!reducedMotion && (
          <img
            ref={topImgRef}
            src={heroPolished}
            alt=""
            aria-hidden="true"
            className="hero-top absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 40%, rgba(0,0,0,.92) 92%)",
          }}
        />

        {!reducedMotion &&
          heroHotspots.map((h) => (
            <HeroHotspotMarker
              key={h.id}
              hotspot={h}
              ref={(el) => {
                hotspotRefs.current[h.id] = el;
              }}
            />
          ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 z-[3] bottom-[clamp(44px,7vh,88px)]">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <p className="text-[0.7rem] font-bold tracking-[0.2em] text-bm-g300 uppercase">
            Agencia de publicidad · Cali, Colombia
          </p>
          <h1 className="relative mt-4 text-[clamp(2.2rem,6vw,4.6rem)] leading-[0.98] font-black tracking-[-0.03em] text-white uppercase">
            {reducedMotion ? (
              <span className="text-bm-orange">
                Nosotros no
                <br />
                te ocultamos
                <br />
                nada.
              </span>
            ) : (
              <>
                <span className="hero-flip hero-flip-a">
                  Toda agencia
                  <br />
                  se vende
                  <br />
                  impecable.
                </span>
                <span className="hero-flip hero-flip-b text-bm-orange">
                  Nosotros no
                  <br />
                  te ocultamos
                  <br />
                  nada.
                </span>
                <span className="invisible" aria-hidden="true">
                  Toda agencia
                  <br />
                  se vende
                  <br />
                  impecable.
                </span>
              </>
            )}
          </h1>
        </div>
      </div>

      <div
        className="pointer-events-none absolute right-[clamp(20px,4vw,56px)] bottom-[clamp(44px,7vh,88px)] z-[4] text-[0.62rem] font-bold tracking-[0.28em] text-bm-g300 uppercase"
        style={{ writingMode: "vertical-rl" }}
      >
        Sigue bajando
      </div>
    </section>
  );
}
