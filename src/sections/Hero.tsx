import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEventHandler,
} from "react";
import heroOriginal from "../assets/images/hero1.jpg";
import heroFinal from "../assets/images/hero2.jpg";
import HeroHeadline from "../components/hero/HeroHeadline";
import HeroDot from "../components/hero/HeroDot";
import HeroMessage from "../components/hero/HeroMessage";
import HeroSpotlight from "../components/hero/HeroSpotlight";
import PhotoLayerTop from "../components/hero/PhotoLayerTop";
import PhotoLayerHidden from "../components/hero/PhotoLayerHidden";
import { heroHotspots } from "../data/heroHotspots";
import { useCoarsePointer } from "../hooks/useCoarsePointer";
import { useSectionInView } from "../hooks/useSectionInView";
import { useSpotlightTour } from "../hooks/useSpotlightTour";

const FEATHER = 76; // % del radio donde empieza el degradado del borde de la máscara
const HIT_RATIO = 0.6; // proximidad (respecto al radio) que activa un hotspot
const EDGE_PADDING = 30; // separación mínima del spotlight respecto al borde del hero
const EDGE_PADDING_COARSE = 8; // en móvil el hero es estrecho: el lente puede acercarse más al borde
const CAPTION_GAP = 14; // separación del caption (móvil) respecto al borde inferior del lente
const CAPTION_WIDTH = 280; // ancho del caption (móvil)
const CAPTION_FLIP_Y = 0.52; // (% del alto) si el caption bajo el lente invadiría el titular, va por encima
const CAPTION_HEIGHT = 80; // alto aproximado del caption, para decidir el lado
const SNAP_MS = 320; // regreso del lente al soltarlo fuera del borde
const TRAVEL_MS = 1400; // viaje del lente entre hotspots (tour / click en un punto)
const REVEAL_MS = 1100; // viaje y expansión final del lente hasta los titulares (móvil)
const REVEAL_PADDING = 22; // aire entre los titulares y el borde del lente en el estado final
const REVEAL_FEATHER = 90; // borde más definido en el estado final (elipse sobre el texto)

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const hiddenLayerRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const msgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRef = useRef<HTMLDivElement>(null);
  const captionMsgRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isDragging, setIsDragging] = useState(false);
  const isCoarse = useCoarsePointer();
  const inView = useSectionInView("inicio");
  // Móvil: fases del hero no interactivo (tour → expansión → todo a la vista)
  const [revealPhase, setRevealPhase] = useState<
    "tour" | "revealing" | "revealed"
  >("tour");
  // Estado final (móvil): elipse que enmarca los titulares. `null` mientras el lente es un círculo normal
  const revealShape = useRef<{
    rx: number;
    ry: number;
    feather: number;
  } | null>(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phase = revealPhase;

  const pos = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const snappingRef = useRef(false);
  const seeded = useRef(false);
  const activeHotspots = useRef(heroHotspots.map(() => false));
  const rafId = useRef<number | null>(null);
  const tweenRafId = useRef<number | null>(null);

  const getRadius = () => (spotRef.current?.offsetWidth ?? 0) / 2 || 160;
  const edgePadding = isCoarse ? EDGE_PADDING_COARSE : EDGE_PADDING;

  // Coordenadas (%) de cada hotspot según el dispositivo
  const points = useMemo(
    () => heroHotspots.map((h) => (isCoarse ? h.mobile : { x: h.x, y: h.y })),
    [isCoarse],
  );

  // Recorta una posición para que el lente quede dentro del hero (con margen)
  const clamp = useCallback(
    (x: number, y: number) => {
      const hero = heroRef.current;
      if (!hero) return { x, y };
      const rect = hero.getBoundingClientRect();
      const pad = Math.min(
        getRadius() + edgePadding,
        rect.width / 2,
        rect.height / 2,
      );
      return {
        x: Math.max(pad, Math.min(rect.width - pad, x)),
        y: Math.max(pad, Math.min(rect.height - pad, y)),
      };
    },
    [edgePadding],
  );

  const apply = useCallback(() => {
    const hero = heroRef.current;
    const hidden = hiddenLayerRef.current;
    const spot = spotRef.current;
    if (!hero || !hidden || !spot) return;

    const rect = hero.getBoundingClientRect();
    if (rect.width < 40 || rect.height < 40) return;

    const radius = getRadius();
    if (!seeded.current) {
      seeded.current = true;
      pos.current.x = Math.min(
        rect.width * 0.78,
        rect.width - radius - edgePadding,
      );
      pos.current.y = Math.min(
        rect.height * 0.72,
        rect.height - radius - edgePadding,
      );
    }

    // Mientras se arrastra o se anima el regreso, la posición no se recorta aquí:
    // el lente puede salir del borde y solo se ajusta al soltarlo.
    if (
      !draggingRef.current &&
      !snappingRef.current &&
      revealShape.current === null
    ) {
      pos.current = clamp(pos.current.x, pos.current.y);
    }

    const shape = revealShape.current;
    const feather = shape ? shape.feather : draggingRef.current ? 100 : FEATHER;
    const size = shape
      ? `ellipse ${shape.rx}px ${shape.ry}px`
      : `circle ${radius}px`;
    const mask = `radial-gradient(${size} at ${pos.current.x}px ${pos.current.y}px, #000 0%, #000 ${feather}%, rgba(0,0,0,0) 100%)`;
    hidden.style.setProperty("-webkit-mask-image", mask);
    hidden.style.setProperty("mask-image", mask);
    spot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;

    // Caption móvil: sigue al lente (debajo, o encima si abajo chocaría con el titular)
    const caption = captionRef.current;
    if (caption) {
      const half = Math.min(CAPTION_WIDTH, rect.width) / 2;
      const cx = Math.max(half, Math.min(rect.width - half, pos.current.x));
      const below = pos.current.y + radius + CAPTION_GAP;
      const above = below + CAPTION_HEIGHT > rect.height * CAPTION_FLIP_Y;
      const cy = above ? pos.current.y - radius - CAPTION_GAP : below;
      caption.dataset.side = above ? "above" : "below";
      caption.style.transform = `translate(${cx - half}px, ${cy}px)`;
    }

    // Desde el revelado final los puntos y mensajes quedan apagados
    if (revealShape.current !== null) {
      dotRefs.current.forEach((dot) => dot && (dot.style.opacity = "0"));
      return;
    }

    const hitDistance = getRadius() * HIT_RATIO;
    points.forEach((point, i) => {
      const dx = (point.x / 100) * rect.width - pos.current.x;
      const dy = (point.y / 100) * rect.height - pos.current.y;
      const isActive = Math.sqrt(dx * dx + dy * dy) < hitDistance;
      if (isActive === activeHotspots.current[i]) return;
      activeHotspots.current[i] = isActive;

      const dot = dotRefs.current[i];
      if (dot) {
        dot.style.opacity = isActive ? "0" : "1";
        dot.style.transform = isActive ? "scale(0.4)" : "scale(1)";
        dot.style.pointerEvents = isActive ? "none" : "";
      }
      for (const message of [msgRefs.current[i], captionMsgRefs.current[i]]) {
        if (message) message.style.opacity = isActive ? "1" : "0";
      }
    });
  }, [clamp, edgePadding, points]);

  // Interpola el lente hasta (targetX, targetY). Resuelve al terminar o al ser interrumpido.
  const tweenTo = useCallback(
    (targetX: number, targetY: number, duration: number) =>
      new Promise<void>((resolve) => {
        if (tweenRafId.current !== null)
          cancelAnimationFrame(tweenRafId.current);
        const startX = pos.current.x;
        const startY = pos.current.y;
        if (startX === targetX && startY === targetY) return resolve();

        snappingRef.current = true;
        const startTime = performance.now();
        const tick = (now: number) => {
          if (draggingRef.current) {
            // El usuario tomó el lente a mitad de camino: cede el control
            snappingRef.current = false;
            tweenRafId.current = null;
            return resolve();
          }
          const t = Math.min((now - startTime) / duration, 1);
          const ease =
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          pos.current.x = startX + (targetX - startX) * ease;
          pos.current.y = startY + (targetY - startY) * ease;
          apply();
          if (t < 1) {
            tweenRafId.current = requestAnimationFrame(tick);
          } else {
            snappingRef.current = false;
            tweenRafId.current = null;
            resolve();
          }
        };
        tweenRafId.current = requestAnimationFrame(tick);
      }),
    [apply],
  );

  // Lleva el lente hasta un hotspot (en px, ya recortado al hero)
  const travelToHotspot = useCallback(
    (index: number) => {
      const hero = heroRef.current;
      const point = points[index];
      if (!hero || !point) return Promise.resolve();
      const rect = hero.getBoundingClientRect();
      const target = clamp(
        (point.x / 100) * rect.width,
        (point.y / 100) * rect.height,
      );
      return tweenTo(target.x, target.y, TRAVEL_MS);
    },
    [clamp, tweenTo, points],
  );

  // Final del tour: el lente viaja hasta los titulares y crece justo para enmarcarlos
  const reveal = useCallback(() => {
    const hero = heroRef.current;
    const spot = spotRef.current;
    if (!hero || !spot) return;
    setRevealPhase("revealing");

    const rect = hero.getBoundingClientRect();
    // Se mide el texto (no la caja del h1, que el texto desborda en pantallas estrechas)
    const headlines = Array.from(hero.querySelectorAll("h1")).map((h) => {
      const range = document.createRange();
      range.selectNodeContents(h);
      return range.getBoundingClientRect();
    });
    const left = Math.min(...headlines.map((r) => r.left)) - rect.left;
    const right = Math.max(...headlines.map((r) => r.right)) - rect.left;
    const top = Math.min(...headlines.map((r) => r.top)) - rect.top;
    const bottom = Math.max(...headlines.map((r) => r.bottom)) - rect.top;

    const targetX = (left + right) / 2;
    const fromRadius = getRadius();
    const sharp = REVEAL_FEATHER / 100; // fracción del radio que la máscara muestra nítida
    // Distancia del centro a la esquina más lejana del texto
    const reach = (cx: number, cy: number) =>
      Math.hypot(
        Math.max(cx - left, right - cx),
        Math.max(cy - top, bottom - cy),
      );
    // Centrado en el texto, con el texto dentro de la zona nítida. Si sobresale por abajo,
    // el hero lo recorta: mejor eso que subir el centro y destapar media foto.
    const targetY = (top + bottom) / 2;
    const toRadius = (reach(targetX, targetY) + REVEAL_PADDING) / sharp;
    const toRx = toRadius;
    const toRy = toRadius;

    // El aro del lente crece con la máscara (mismo tiempo y curva)
    spot.style.transition = `margin ${REVEAL_MS}ms ease-in-out, height ${REVEAL_MS}ms ease-in-out, width ${REVEAL_MS}ms ease-in-out`;
    spot.style.width = `${toRx * 2}px`;
    spot.style.height = `${toRy * 2}px`;
    spot.style.marginLeft = `${-toRx}px`;
    spot.style.marginTop = `${-toRy}px`;

    const startX = pos.current.x;
    const startY = pos.current.y;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / REVEAL_MS, 1);
      const ease = t * t * (3 - 2 * t);
      pos.current.x = startX + (targetX - startX) * ease;
      pos.current.y = startY + (targetY - startY) * ease;
      revealShape.current = {
        rx: fromRadius + (toRx - fromRadius) * ease,
        ry: fromRadius + (toRy - fromRadius) * ease,
        feather: FEATHER + (REVEAL_FEATHER - FEATHER) * ease,
      };
      apply();
      if (t < 1) requestAnimationFrame(tick);
      else setRevealPhase("revealed");
    };
    requestAnimationFrame(tick);
  }, [apply]);

  // En táctil el hero no es interactivo: el lente recorre los hotspots una vez y acaba sobre los titulares
  useSpotlightTour({
    enabled: isCoarse && inView && phase === "tour",
    stops: reducedMotion ? 0 : heroHotspots.length,
    travelTo: travelToHotspot,
    onComplete: reveal,
    startDelayMs: reducedMotion ? 0 : undefined,
  });

  // Al cambiar de dispositivo cambian los puntos: recalcula hotspots activos
  useEffect(() => {
    activeHotspots.current = heroHotspots.map(() => false);
    apply();
  }, [isCoarse, apply]);

  const handleDotClick = (index: number) => {
    if (isCoarse) return;
    travelToHotspot(index);
  };

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

      const target = clamp(pos.current.x, pos.current.y);
      tweenTo(target.x, target.y, SNAP_MS);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    // En táctil, un gesto vertical pasa a ser scroll y el navegador cancela el puntero
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      if (tweenRafId.current !== null) cancelAnimationFrame(tweenRafId.current);
    };
  }, [apply, clamp, tweenTo]);

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
      className="font-archivo relative h-screen min-h-[660px] overflow-hidden bg-bm-ink select-none"
    >
      <PhotoLayerTop
        src={heroFinal}
        alt="Equipo de Blackmouth, resultado final"
      />

      <PhotoLayerHidden
        ref={hiddenLayerRef}
        src={heroOriginal}
        alt="El mismo set con las luces y equipos a la vista"
      >
        <HeroHeadline variant="hidden">
          <span className="block whitespace-nowrap">Nosotros no</span>
          <span className="block whitespace-nowrap">te ocultamos</span>
          <span className="block whitespace-nowrap">nada.</span>
        </HeroHeadline>
        {!isCoarse &&
          heroHotspots.map((hotspot, i) => (
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
          point={points[i]}
          hidden={phase !== "tour"}
          interactive={!isCoarse}
          onClick={() => handleDotClick(i)}
          ref={(el) => {
            dotRefs.current[i] = el;
          }}
        />
      ))}

      <HeroSpotlight
        ref={spotRef}
        isDragging={isDragging}
        settled={phase !== "tour"}
        interactive={!isCoarse}
        onPointerDown={handlePointerDown}
      />

      {/* Táctil: el mensaje activo va fuera de la máscara, como caption bajo el lente */}
      {isCoarse && (
        <div
          ref={captionRef}
          className={`group/cap pointer-events-none absolute top-0 left-0 h-0 transition-opacity duration-300 ${
            phase === "tour" ? "opacity-100" : "opacity-0"
          }`}
          style={{ width: `min(${CAPTION_WIDTH}px, 100%)` }}
        >
          {heroHotspots.map((hotspot, i) => (
            <HeroMessage
              key={hotspot.title}
              hotspot={hotspot}
              variant="caption"
              ref={(el) => {
                captionMsgRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
