interface StickyVisualProps {
  children: React.ReactNode;
}

export default function StickyVisual({ children }: StickyVisualProps) {
  return (
    <div className="p-8 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-1/2 lg:items-center lg:justify-center">
      <div className="w-full max-w-lg">{children}</div>
    </div>
  );
}
