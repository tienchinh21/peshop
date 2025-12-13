export default function ProductDetailSkeleton() {
  return <div className="grid gap-6 lg:grid-cols-12 animate-pulse">
      {}
      <div className="lg:col-span-5 space-y-6">
        <div className="aspect-square bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({
          length: 7
        }).map((_, i) => <div key={i} className="aspect-square bg-gray-200 rounded-md" />)}
        </div>
      </div>

      {}
      <div className="lg:col-span-7 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-12 bg-gray-200 rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="flex gap-2">
            {Array.from({
            length: 4
          }).map((_, i) => <div key={i} className="h-10 w-20 bg-gray-200 rounded" />)}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-12 flex-1 bg-gray-200 rounded" />
          <div className="h-12 flex-1 bg-gray-200 rounded" />
        </div>
      </div>
    </div>;
}