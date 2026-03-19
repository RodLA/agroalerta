import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function AlertCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden border-none shadow-sm flex flex-col">
      <CardHeader className="space-y-2 pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-16 bg-slate-200 rounded animate-pulse" />
        </div>

        <div className="h-6 w-full bg-slate-200 rounded animate-pulse mt-2" />
        <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />

        <div className="flex flex-wrap gap-1 pt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4 grow">
        <div className="space-y-2 mt-2">
          <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="h-3 w-3 bg-slate-100 rounded-full animate-pulse" />
          <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center bg-slate-50/50 mt-auto">
        <div className="flex items-center gap-1.5 pt-4">
          <div className="h-3 w-3 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-1.5 pt-4">
          <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
        </div>
      </CardFooter>
    </Card>
  )
}
