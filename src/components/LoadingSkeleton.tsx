export default function LoadingSkeleton() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading content">
      <div className="w-full max-w-lg space-y-4 p-8">
        <div className="skeleton-pulse h-8 w-3/4" />
        <div className="skeleton-pulse h-4 w-full" />
        <div className="skeleton-pulse h-4 w-5/6" />
        <div className="skeleton-pulse mt-6 h-48 w-full" />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
