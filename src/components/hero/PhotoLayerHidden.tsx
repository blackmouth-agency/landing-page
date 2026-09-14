import { forwardRef, type ReactNode } from "react";

interface PhotoLayerHiddenProps {
  src: string;
  alt: string;
  children: ReactNode;
}

const PhotoLayerHidden = forwardRef<HTMLDivElement, PhotoLayerHiddenProps>(
  function PhotoLayerHidden({ src, alt, children }, ref) {
    return (
      <div ref={ref} className="absolute inset-0">
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="bm-shade-hidden pointer-events-none absolute inset-0" />
        {children}
      </div>
    );
  },
);

export default PhotoLayerHidden;
