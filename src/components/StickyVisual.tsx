interface StickyVisualProps {
  children: React.ReactNode;
}

export default function StickyVisual({ children }: StickyVisualProps) {
  return (
    <div className="p-8 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-3/5 lg:items-center lg:justify-center">
      <div className="mx-auto w-full max-w-xl" style={{ maxHeight: "calc(100vh - 6rem)", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}
