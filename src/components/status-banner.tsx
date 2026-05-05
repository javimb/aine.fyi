interface StatusBannerProps {
  banner: string;
  textClass: string;
}

export default function StatusBanner({ banner, textClass }: StatusBannerProps) {
  return (
    <div
      className={`mb-2 text-sm font-bold uppercase tracking-wide ${textClass}`}
    >
      {banner}
    </div>
  );
}
