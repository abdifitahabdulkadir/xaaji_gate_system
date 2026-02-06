import { Skeleton } from "../ui/skeleton";

export function TableSkelton({
  rows = 3,
  cols,
}: {
  rows?: number;
  cols: number;
}) {
  return (
    <div className="w-full border rounded-2xl overflow-hidden">
      <div className="grid grid-cols-7 bg-orange-600 text-white font-semibold text-sm md:text-base">
        {Array.from({ length: cols }, (_, index) => (
          <div key={index} className="px-4 py-3">
            <Skeleton className="h-4 w-full rounded" />
          </div>
        ))}
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-7 bg-gray-50">
            {Array.from({ length: cols }, (_, index) => (
              <div key={index} className="px-4 py-4">
                <Skeleton className="h-4 w-full rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
