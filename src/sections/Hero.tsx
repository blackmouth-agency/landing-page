import { useCallback, useEffect, useRef, useState, type PointerEventHandler } from "react";
import heroOriginal from "../assets/images/hero1.jpg";
import heroFinal from "../assets/images/hero2.jpg";
import HeroBrand from "../components/hero/HeroBrand";
import HeroHeadline from "../components/hero/HeroHeadline";
import HeroDot from "../components/hero/HeroDot";
import HeroMessage from "../components/hero/HeroMessage";
import HeroSpotlight from "../components/hero/HeroSpotlight";
import PhotoLayerTop from "../components/hero/PhotoLayerTop";
import PhotoLayerHidden from "../components/hero/PhotoLayerHidden";
import { heroHotspots } from "../data/heroHotspots";

const FEATHER = 76; // % del radio donde empieza el degradado del borde de la máscara
const HIT_RATIO = 0.6; // proximidad (respecto al radio) que activa un hotspot
const EDGE_PADDING = 30; // separación mínima del spotlight respecto al borde del hero

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const hiddenLayerRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const msgRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isDragging, setIsDragging] = useState(false);

  const pos = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const snappingRef = useRef(false);
  const seeded = useRef(false);
  const activeHotspots = useRef(heroHotspots.map(() => false));
  const rafId = useRef<number | null>(null);
  const snapRafId = useRef<number | null>(null);

  const apply = useCallback(() => {
    const hero = heroRef.current;
    const hidden = hiddenLayerRef.current;
    const spot = spotRef.current;
    if (!hero || !hidden || !spot) return;

    const rect = hero.getBoundingClientRect();
    if (rect.width < 40 || rect.height < 40) return;

    const radius = spot.offsetWidth / 2 || 160;
    if (!seeded.current) {
      seeded.current = true;
      pos.current.x = Math.min(rect.width * 0.78, rect.width - radius - EDGE_PADDING);
      pos.current.y = Math.min(rect.height * 0.72, rect.height - radius - EDGE_PADDING);
    }

    // Mientras se arrastra o se anima el regreso, la posición no se recorta aquí:
    // el lente puede salir del borde y solo se ajusta al soltarlo.
    if (!draggingRef.current && !snappingRef.current) {
      const pad = Math.min(radius + EDGE_PADDING, rect.width / 2, rect.height / 2);
      pos.current.x = Math.max(pad, Math.min(rect.width - pad, pos.current.x));
      pos.current.y = Math.max(pad, Math.min(rect.height - pad, pos.current.y));
    }

    const feather = draggingRef.current ? 100 : FEATHER;
    const mask = `radial-gradient(circle ${radius}px at ${pos.current.x}px ${pos.current.y}px, #000 0%, #000 ${feather}%, rgba(0,0,0,0) 100%)`;
    hidden.style.setProperty("-webkit-mask-image", mask);
    hidden.style.setProperty("mask-image", mask);
    spot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;

    const hitDistance = radius * HIT_RATIO;
    heroHotspots.forEach((hotspot, i) => {
      const dx = (hotspot.x / 100) * rect.width - pos.current.x;
      const dy = (hotspot.y / 100) * rect.height - pos.current.y;
      const isActive = Math.sqrt(dx * dx + dy * dy) < hitDistance;
      if (isActive === activeHotspots.current[i]) return;
      activeHotspots.current[i] = isActive;

      const dot = dotRefs.current[i];
      if (dot) {
        dot.style.opacity = isActive ? "0" : "1";
        dot.style.transform = isActive ? "scale(0.4)" : "scale(1)";
      }
      const message = msgRefs.current[i];
      if (message) message.style.opacity = isActive ? "1" : "0";
    });
  }, []);

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    dragOffset.current.x = pos.current.x - (e.clientX - rect.left);
    dragOffset.current.y = pos.current.y - (e.clientY - rect.top);
    draggingRef.current = true;
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const hero = heroRef.current;
      if (!draggingRef.current || !hero) return;
      const rect = hero.getBoundingClientRect();
      pos.current.x = e.clientX - rect.left + dragOffset.current.x;
      pos.current.y = e.clientY - rect.top + dragOffset.current.y;
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        apply();
      });
    };

    const handlePointerUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);

      const hero = heroRef.current;
      const spot = spotRef.current;
      if (!hero || !spot) return;
      const rect = hero.getBoundingClientRect();
      const radius = spot.offsetWidth / 2 || 160;
      const pad = Math.min(radius + EDGE_PADDING, rect.width / 2, rect.height / 2);
      const targetX = Math.max(pad, Math.min(rect.width - pad, pos.current.x));
      const targetY = Math.max(pad, Math.min(rect.height - pad, pos.current.y));

      if (targetX === pos.current.x && targetY === pos.current.y) return;

      if (snapRafId.current !== null) cancelAnimationFrame(snapRafId.current);
      snappingRef.current = true;
      const startX = pos.current.x;
      const startY = pos.current.y;
      const startTime = performance.now();
      const duration = 320;

      const tick = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        pos.current.x = startX + (targetX - startX) * ease;
        pos.current.y = startY + (targetY - startY) * ease;
        apply();
        if (t < 1) {
          snapRafId.current = requestAnimationFrame(tick);
        } else {
          snappingRef.current = false;
          snapRafId.current = null;
        }
      };
      snapRafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      if (snapRafId.current !== null) cancelAnimationFrame(snapRafId.current);
    };
  }, [apply]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new ResizeObserver(apply);
    observer.observe(hero);
    apply();
    return () => observer.disconnect();
  }, [apply]);

  // Sincroniza la máscara con la animación de expansión/contracción del lente
  useEffect(() => {
    const start = performance.now();
    let id: number;
    const tick = (now: number) => {
      apply();
      if (now - start < 320) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [isDragging, apply]);

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="font-archivo relative h-screen min-h-[660px] touch-none overflow-hidden bg-bm-ink select-none"
    >
      <PhotoLayerTop src={heroFinal} alt="Equipo de Blackmouth, resultado final" />

      <PhotoLayerHidden ref={hiddenLayerRef} src={heroOriginal} alt="El mismo set con las luces y equipos a la vista">
        <HeroHeadline variant="hidden">
          <span className="block whitespace-nowrap">Nosotros no</span>
          <span className="block whitespace-nowrap">te ocultamos</span>
          <span className="block whitespace-nowrap">nada.</span>
        </HeroHeadline>
        {heroHotspots.map((hotspot, i) => (
          <HeroMessage
            key={hotspot.title}
            hotspot={hotspot}
            ref={(el) => {
              msgRefs.current[i] = el;
            }}
          />
        ))}
      </PhotoLayerHidden>

      {/* Sombra inferior compartida por ambas capas (vignette), sobre la capa oculta */}
      <div className="bm-shade pointer-events-none absolute inset-0" />

      <HeroBrand />

      <HeroHeadline variant="visible">
        <span className="block whitespace-nowrap">Toda agencia</span>
        <span className="block whitespace-nowrap">se vende</span>
        <span className="block whitespace-nowrap">
          impecable<span className="text-bm-orange">.</span>
        </span>
      </HeroHeadline>

      {heroHotspots.map((hotspot, i) => (
        <HeroDot
          key={hotspot.title}
          hotspot={hotspot}
          ref={(el) => {
            dotRefs.current[i] = el;
          }}
        />
      ))}

      <HeroSpotlight ref={spotRef} isDragging={isDragging} onPointerDown={handlePointerDown} />
    </section>
  );
}
