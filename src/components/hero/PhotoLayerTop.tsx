interface PhotoLayerTopProps {
  src: string;
  alt: string;
}

export default function PhotoLayerTop({ src, alt }: PhotoLayerTopProps) {
  return (
    <>
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="bm-wash pointer-events-none absolute inset-0" />
    </>
  );
}
