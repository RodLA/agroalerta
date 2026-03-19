"use client"

import { useEffect, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { ReportData } from "@/types/report"
import { DEPARTMENTS } from "@/lib/data"
import { useSearchStore } from "@/store/useSearchStore"
import { Province } from "@/types/metrics"

interface ReportMapProps {
  data: ReportData
  dept: string | null
  selectedCrop?: string
  selectedRisk?: string
}

const riskColors: Record<string, string> = {
  "MUY ALTO": "#dc2626", // red-600
  "ALTO": "#ea580c",    // orange-600
  "MEDIO": "#f59e0b",   // amber-500
  "BAJO": "#16a34a",    // green-600
  "MUY BAJO": "#10b981"  // emerald-500
}

const riskPriority: Record<string, number> = {
  "MUY ALTO": 1,
  "ALTO": 2,
  "MEDIO": 3,
  "BAJO": 4,
  "MUY BAJO": 5
}

function getMarkerIcon(count: number, risk: string) {
  const color = riskColors[risk] || "#64748b"
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="
        background-color: ${color}; 
        width: ${30 + Math.min(count * 2, 20)}px; 
        height: ${30 + Math.min(count * 2, 20)}px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 0 10px ${color}80;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        transition: transform 0.2s;
      " class="hover:scale-110">
        ${count}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

function MapUpdater({ dept }: { dept: string | null }) {
  const map = useMap()
  useEffect(() => {
    if (dept && dept !== "Todos") {
      const department = DEPARTMENTS.find(d => d.value === dept)
      if (department) {
        map.setView([department.lat, department.lon], department.zoom)
      }
    } else {
      map.setView([-9.19, -75.0152], 5)
    }
  }, [dept, map])
  return null
}

export function ReportMap({ data, dept, selectedCrop, selectedRisk }: ReportMapProps) {
  const { provinces } = useSearchStore()
  const defaultCenter: [number, number] = [-9.19, -75.0152]
  const defaultZoom = 5

  const filteredLocations = useMemo(() => {
    let locations: Array<{ id: number; risk: string; count: number; cropName: string }> = []

    Object.entries(data.locations).forEach(([cropId, reports]) => {
      if (selectedCrop && selectedCrop !== "Todos" && cropId !== selectedCrop) return

      const crop = data.crops.find(c => c.id === cropId)

      reports.forEach(report => {
        if (selectedRisk && selectedRisk !== "Todos" && report.risk !== selectedRisk) return

        locations.push({
          ...report,
          cropName: crop?.name || cropId
        })
      })
    })

    const grouped = locations.reduce((acc, curr) => {
      if (!acc[curr.id]) {
        acc[curr.id] = { ...curr, details: [curr] }
      } else {
        acc[curr.id].count += curr.count
        acc[curr.id].details.push(curr)

        const currentRiskPriority = riskPriority[curr.risk] || 99
        const existingRiskPriority = riskPriority[acc[curr.id].risk] || 99

        if (currentRiskPriority < existingRiskPriority) {
          acc[curr.id].risk = curr.risk
        }
      }
      return acc
    }, {} as Record<number, any>)

    return Object.values(grouped)
  }, [data, selectedCrop, selectedRisk])

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border shadow-inner bg-slate-100 z-0 relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full"
        zoomSnap={0}
      >
        <MapUpdater dept={dept} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredLocations.map((loc, idx) => {
          const isProvinceMode = dept && dept !== "Todos"
          
          let departmentLabel = ""
          let locationLabel = ""
          let position: [number, number] = defaultCenter
          let departmentObj: any = null

          if (isProvinceMode) {
            // loc.id is a province ID/ubigeo
            departmentObj = DEPARTMENTS.find(d => d.value === dept)
            const provinceObj = provinces.find((p: Province) => p.ubigeo === loc.id)
            departmentLabel = departmentObj?.label || ""
            locationLabel = provinceObj?.name || `Provincia ${loc.id}`
            
            // Marker positioning: offset from department center for provinces
            if (departmentObj) {
              position = [
                departmentObj.lat + (Math.random() - 0.5) * 0.4, 
                departmentObj.lon + (Math.random() - 0.5) * 0.4
              ]
            }
          } else {
            // loc.id is a department ID/ubigeo
            departmentObj = DEPARTMENTS.find(d => Number(d.value) === loc.id)
            departmentLabel = departmentObj?.label || "Ubicación"
            locationLabel = departmentLabel
            if (departmentObj) {
              position = [departmentObj.lat, departmentObj.lon]
            }
          }

          const uniqueCrops = Array.from(new Set(loc.details.map((d: any) => d.cropName)))
          const displayedCrops = uniqueCrops.slice(0, 3).join(", ")
          const remainingCropsCount = uniqueCrops.length - 3

          return (
            <Marker
              key={`${loc.id}-${idx}`}
              position={position}
              icon={getMarkerIcon(loc.count, loc.risk)}
              eventHandlers={{
                click: (e) => {
                  if (departmentObj) {
                    const map = e.target._map
                    map.setView([departmentObj.lat, departmentObj.lon], departmentObj.zoom)
                  }
                }
              }}
            >
              <Popup keepInView={true}>
                <div className="min-w-[180px]">
                  <div className="mb-2">
                    <h3 className="text-xs font-bold text-slate-900 mb-0.5">
                      {isProvinceMode ? `${departmentLabel} / ${locationLabel}` : departmentLabel}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: riskColors[loc.risk] }} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {loc.risk}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-100 space-y-2">
                    <div className="mt-2">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tight">Alertas detectadas</p>
                      <p className="text-sm font-bold text-slate-800 my-0">{loc.count}</p>
                    </div>
                    
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tight">Cultivos afectados</p>
                      <p className="text-[11px] text-slate-600 italic leading-tight">
                        {displayedCrops}
                        {remainingCropsCount > 0 ? ` y ${remainingCropsCount} más` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
