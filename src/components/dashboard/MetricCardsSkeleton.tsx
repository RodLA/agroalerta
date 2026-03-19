import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function MetricCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="overflow-hidden border shadow-sm bg-slate-100/50 border-slate-200">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse order-2 sm:order-1" />
            <div className="p-2 rounded-full order-1 sm:order-2 bg-slate-200 h-8 w-8 animate-pulse" />
          </CardHeader>
          <CardContent className="h-full flex flex-col justify-end text-center sm:text-start pt-4">
            <div className="h-8 w-16 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
