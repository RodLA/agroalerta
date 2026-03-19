"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Alert, RiskLevel } from "@/lib/mock-data"
import { DEPARTMENTS } from "@/lib/data"
import { MapPin, AlertTriangle, Sprout, Info } from "lucide-react"
import { cn } from "@/lib/utils"

// Extended Alert type to include departmentIds and organized provinces
interface ExtendedAlert extends Alert {
  departmentIds?: (string | number)[]
  departmentProvinces?: Record<string | number, string[]>
}

const riskLevelColors: Record<RiskLevel, { bg: string, text: string, border: string, hex: string }> = {
  "Muy Alto": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", hex: "#dc2626" },
  "Alto": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", hex: "#ea580c" },
  "Medio": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", hex: "#f59e0b" },
  "Bajo": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", hex: "#16a34a" },
  "Muy Bajo": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", hex: "#10b981" }
}

// Fix for default marker icons
const getIcon = (risk: RiskLevel) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${riskLevelColors[risk].hex}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px ${riskLevelColors[risk].hex}80;"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

function MarkerPopup({ alert, deptLabel, provinces }: { alert: ExtendedAlert, deptLabel?: string, provinces?: string[] }) {
  const [showProvinces, setShowProvinces] = useState(false);

  return (
    <div className="flex flex-col overflow-hidden max-h-[300px] overflow-y-auto">
      <div className={cn("px-4 py-2 text-white font-bold text-xs flex items-center gap-2",
        alert.risk === "Muy Alto" ? "bg-red-600" :
          alert.risk === "Alto" ? "bg-orange-600" :
            alert.risk === "Medio" ? "bg-amber-500" :
              alert.risk === "Bajo" ? "bg-green-600" : "bg-emerald-500")}>
        <AlertTriangle className="h-3 w-3" />
        Riesgo {alert.risk}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h4 className="font-bold uppercase text-slate-500 leading-tight text-xs mb-1">Región:</h4>
          <div className="flex items-center gap-1.5 text-slate-700">
            <MapPin className="h-3 w-3 text-slate-400" />
            <span className="text-[11px] font-black uppercase tracking-wider">{deptLabel || alert.departments.join(", ")}</span>
          </div>
        </div>

        <button 
          onClick={() => setShowProvinces(!showProvinces)}
          className="flex items-center gap-2 text-[10px] text-blue-600 font-bold hover:text-blue-800 transition-colors uppercase tracking-tight cursor-pointer"
        >
          <Info className="h-3 w-3" />
          {showProvinces ? "Ocultar detalles" : "Ver provincias afectadas"}
        </button>

        {showProvinces && provinces && (
          <div className="bg-slate-50 rounded-lg p-2 pt-0 border border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Provincias:</p>
            <div className="flex flex-wrap gap-1">
              {provinces.map((prov, i) => (
                <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded shadow-sm">
                  {prov}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-0 border-t border-slate-100">
           <p className="text-[9px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Cultivos:</p>
          <div className="flex items-start gap-2">
            <div className="flex flex-wrap gap-1">
              {alert.crops.map((crop, i) => (
                <span key={i} className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded leading-none border border-emerald-100/50">
                  {crop}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PeruMapProps {
  alerts: ExtendedAlert[]
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

export default function PeruMap({ alerts }: PeruMapProps) {
  const defaultCenter: [number, number] = [-9.19, -75.0152] // Center of Peru
  const defaultZoom = 5

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border shadow-inner bg-slate-100 z-0">
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          padding: 0;
          overflow: hidden;
          border-radius: 12px;
          border: none;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: 240px !important;
        }
        .leaflet-popup-tip {
          box-shadow: none;
        }
      `}</style>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {alerts.flatMap((alert) => {
          if (alert.departmentIds && alert.departmentIds.length > 0) {
            return alert.departmentIds.map(deptId => {
              const dept = DEPARTMENTS.find(d => String(d.value) === String(deptId));
              if (!dept || !dept.lat || !dept.lon) return null;
              
              const Provinces = alert.departmentProvinces?.[deptId];

              return (
                <Marker
                  key={`${alert.id}-${deptId}`}
                  position={[dept.lat, dept.lon]}
                  icon={getIcon(alert.risk)}
                >
                  <Popup>
                    <MarkerPopup alert={alert} deptLabel={dept.label} provinces={Provinces} />
                  </Popup>
                </Marker>
              );
            });
          }

          // Fallback to single coordinate
          return (
            <Marker
              key={alert.id}
              position={alert.coordinates}
              icon={getIcon(alert.risk)}
            >
              <Popup>
                <MarkerPopup alert={alert} provinces={alert.provinces} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  )
}
