interface MenuToggleProps {
  open: boolean;
  onClick: () => void;
  controls: string;
}

const barClasses = [
  "translate-y-[7px] rotate-45",
  "opacity-0",
  "-translate-y-[7px] -rotate-45",
];

export default function MenuToggle({ open, onClick, controls }: MenuToggleProps) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? "Cerrar menú" : "Abrir menú"}
      onClick={onClick}
      className="flex h-6 w-6 flex-col items-center justify-center gap-[5px] md:hidden"
    >
      {barClasses.map((openClass, i) => (
        <span
          key={i}
          className={`block h-[2px] w-full bg-white transition-all duration-200 ${open ? openClass : ""}`}
        />
      ))}
    </button>
  );
}
