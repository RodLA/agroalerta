import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, MapPin, Activity, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getSummaryData } from "@/actions/action"

export async function MetricCards() {
  const data = await getSummaryData()

  const cards = [
    {
      title: "Total de Alertas",
      value: data.totalAlerts,
      description: "Alertas activas",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      borderColor: "border-blue-200",
      textSize: "text-3xl"
    },
    {
      title: "Alertas Críticas",
      value: data.totalCritical,
      description: "Riesgo Muy Alto",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      iconBg: "bg-red-100",
      borderColor: "border-red-200",
      textSize: "text-3xl"
    },
    {
      title: "Departamentos",
      value: data.totalDepts,
      description: "De 25 con Alerta",
      icon: MapPin,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
      borderColor: "border-amber-200",
      textSize: "text-3xl"
    },
    {
      title: "Sincronización",
      value: formatDate(data.lastUpdate),
      description: "Última actualización",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      borderColor: "border-green-200",
      textSize: "text-sm sm:text-base lg:text-sm xl:text-lg"
    }
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className={`overflow-hidden border shadow-sm transition-all hover:shadow-md ${card.bgColor} ${card.borderColor}`}>
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-lg font-bold text-slate-900 order-2 sm:order-1 text-center sm:text-left">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full order-1 sm:order-2 ${card.iconBg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent className="h-full flex flex-col justify-end text-center sm:text-start">
            <p className={`font-bold  ${card.textSize}`}>{card.value}</p>
            <p className="text-xs text-muted-foreground pt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
