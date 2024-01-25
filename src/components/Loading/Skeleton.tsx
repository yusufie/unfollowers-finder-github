import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDemo() {
  const numberOfSkeletons = 12;

  return (
    <>
    {[...Array(numberOfSkeletons)].map((_, index) => (
    <div key={index} className="flex items-center space-x-4 w-96 p-4 rounded-lg border ">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
    ))}
    </>
  )
}