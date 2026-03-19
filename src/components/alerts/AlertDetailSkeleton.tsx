import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AlertDetailSkeleton() {
  return (
    <div className="bg-slate-50 min-h-screen pb-12 animate-pulse">
      {/* Banner Encabezado Skeleton */}
      <div className="w-full py-12 md:py-16 bg-slate-200 text-center px-4">
        <div className="container max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-6 w-32 bg-slate-300" />
            <Skeleton className="h-12 w-3/4 md:w-1/2 bg-slate-300" />
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-40 bg-slate-300" />
              <Skeleton className="h-4 w-32 bg-slate-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Zonas Afectadas Skeleton */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3 border-b">
                <Skeleton className="h-6 w-48 bg-slate-200" />
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 bg-slate-200" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 bg-slate-200" />
                    <Skeleton className="h-6 w-24 bg-slate-200" />
                    <Skeleton className="h-6 w-20 bg-slate-200" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalle de la Alerta Skeleton */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3 border-b">
                <Skeleton className="h-6 w-48 bg-slate-200" />
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-20 w-full bg-slate-100" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-slate-200" />
                  <Skeleton className="h-4 w-full bg-slate-200" />
                  <Skeleton className="h-4 w-3/4 bg-slate-200" />
                </div>
              </CardContent>
            </Card>

            {/* Recomendaciones Skeleton */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3 border-b">
                <Skeleton className="h-6 w-48 bg-slate-200" />
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-6 w-6 rounded-full bg-slate-200" />
                    <Skeleton className="h-12 flex-1 bg-slate-200" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Columna Secundaria Skeleton */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm h-[300px]">
              <Skeleton className="h-full w-full bg-slate-200" />
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3 border-b">
                <Skeleton className="h-4 w-40 bg-slate-200" />
              </CardHeader>
              <CardContent className="pt-4 flex gap-2">
                <Skeleton className="h-6 w-20 bg-slate-200" />
                <Skeleton className="h-6 w-20 bg-slate-200" />
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm h-48">
              <Skeleton className="h-full w-full bg-slate-800" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
