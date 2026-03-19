import { notFound } from "next/navigation"
import { findAlertById } from "@/actions/action"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Nuevos componentes modulares
import { AlertDetailHeader } from "@/components/alerts/detail/AlertDetailHeader"
import { AlertDetailCrops } from "@/components/alerts/detail/AlertDetailCrops"
import { AlertDetailZones } from "@/components/alerts/detail/AlertDetailZones"
import { AlertDetailInfo } from "@/components/alerts/detail/AlertDetailInfo"
import { AlertDetailRecommendations } from "@/components/alerts/detail/AlertDetailRecommendations"
import { AlertDetailMap } from "@/components/alerts/detail/AlertDetailMap"
import { AlertDetailSource } from "@/components/alerts/detail/AlertDetailSource"
import { AlertDetailTTS } from "@/components/alerts/detail/AlertDetailTTS"

const riskColors: Record<string, string> = {
  "MUY_ALTO": "bg-red-600 border-red-700 shadow-red-100",
  "ALTO": "bg-orange-600 border-orange-700 shadow-orange-100",
  "MEDIO": "bg-amber-500 border-amber-600 shadow-amber-100",
  "BAJO": "bg-green-600 border-green-700 shadow-green-100",
  "MUY_BAJO": "bg-emerald-500 border-emerald-600 shadow-emerald-100"
}

const riskLabels: Record<string, string> = {
  "MUY_ALTO": "Muy Alto",
  "ALTO": "Alto",
  "MEDIO": "Medio",
  "BAJO": "Bajo",
  "MUY_BAJO": "Muy Bajo"
}

export default async function AlertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const alert = await findAlertById(id)

  if (!alert) {
    notFound()
  }

  const formattedDate = alert.riskDate ? format(new Date(alert.riskDate), "MMMM yyyy", { locale: es }) : "N/A"
  const discoveredDate = alert.source.discoveredAt ? format(new Date(alert.source.discoveredAt), "d 'de' MMMM, yyyy HH:mm", { locale: es }) : "N/A"
  const processedDate = alert.processedAt ? format(new Date(alert.processedAt), "d 'de' MMMM, yyyy HH:mm", { locale: es }) : "N/A"

  // Datos preparados para el mapa
  const mapAlertData = {
    id: alert.id,
    title: alert.title,
    type: alert.event.name,
    date: formattedDate,
    risk: (riskLabels[alert.risk] || "Bajo") as any,
    description: alert.summary,
    departments: alert.departments.map(d => d.name),
    departmentIds: alert.departments.map(d => d.id),
    departmentProvinces: alert.departments.reduce((acc, d) => {
      acc[d.id] = d.provinces.map(p => p.name);
      return acc;
    }, {} as Record<string | number, string[]>),
    provinces: alert.departments.flatMap(d => d.provinces.map(p => p.name)),
    crops: alert.crops.map(c => c.name),
    source: alert.source.site,
    detailedInfo: alert.description,
    recommendations: alert.recommendations.map(r => r.reco),
    coordinates: [-9.19, -75.0152]
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <AlertDetailHeader 
        alertTitle={alert.title}
        eventType={alert.event.id}
        riskLevel={alert.risk}
        riskLabels={riskLabels}
        riskColors={riskColors}
        formattedDate={formattedDate}
        deptCount={alert.departments.length}
      />

      <div className="container mx-auto max-w-7xl px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Columna Principal (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            <AlertDetailCrops crops={alert.crops} />
            <AlertDetailZones departments={alert.departments} />
            <AlertDetailInfo summary={alert.summary} description={alert.description} />
            <AlertDetailRecommendations recommendations={alert.recommendations} />
          </div>

          {/* Columna Secundaria (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            <AlertDetailMap mapAlertData={mapAlertData} />
            <AlertDetailSource 
              source={alert.source} 
              discoveredDate={discoveredDate} 
              processedDate={processedDate} 
            />
          </div>

        </div>
      </div>
      <AlertDetailTTS text={alert.summary} />
    </div>
  )
}
