import type { ReactNode } from "react";

type HeroHeadlineVariant = "visible" | "hidden";

interface HeroHeadlineProps {
  variant: HeroHeadlineVariant;
  children: ReactNode;
}

const variantClasses: Record<HeroHeadlineVariant, string> = {
  visible: "top-[64%] -translate-y-full text-bm-white",
  hidden: "top-[calc(64%+16px)] text-bm-orange",
};

export default function HeroHeadline({ variant, children }: HeroHeadlineProps) {
  return (
    <h1
      className={`text-bm-h1 pointer-events-none absolute left-bm-gutter w-bm-col text-pretty uppercase ${variantClasses[variant]}`}
    >
      {children}
    </h1>
  );
}
