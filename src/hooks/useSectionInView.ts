import { useEffect, useState } from "react";

/** Devuelve `true` mientras la sección con ese id siga visible (aunque sea en parte) en el viewport. */
export function useSectionInView(sectionId: string) {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        threshold: 0,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionId]);

  return inView;
}
