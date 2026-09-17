import { useEffect } from "react";

interface SpotlightTourOptions {
  /** Si es `false` el tour no arranca (desktop, reduced motion, hero fuera de vista, ya completado) */
  enabled: boolean;
  /** Número de paradas del recorrido */
  stops: number;
  /** Mueve el lente hasta la parada `index`; resuelve cuando termina el trayecto */
  travelTo: (index: number) => Promise<void>;
  /** Se llama tras reposar en la última parada */
  onComplete: () => void;
  /** Tiempo que el lente reposa sobre cada parada */
  dwellMs?: number;
  /** Retardo antes de la primera parada */
  startDelayMs?: number;
}

/** Recorre los hotspots una vez, de uno en uno, y avisa al terminar. */
export function useSpotlightTour({
  enabled,
  stops,
  travelTo,
  onComplete,
  dwellMs = 2200,
  startDelayMs = 900,
}: SpotlightTourOptions) {
  useEffect(() => {
    if (!enabled) return;

    let alive = true;
    let timer: number | null = null;

    const step = async (index: number) => {
      if (!alive) return;
      await travelTo(index);
      if (!alive) return;
      const next = index + 1;
      timer = window.setTimeout(
        next < stops ? () => step(next) : onComplete,
        dwellMs,
      );
    };

    // Sin paradas (reduced motion) se pasa directo al final
    timer = window.setTimeout(
      stops > 0 ? () => step(0) : onComplete,
      startDelayMs,
    );

    return () => {
      alive = false;
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [enabled, stops, travelTo, onComplete, dwellMs, startDelayMs]);
}
