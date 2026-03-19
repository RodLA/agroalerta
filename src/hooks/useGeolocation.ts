import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSearchStore } from "@/store/useSearchStore"
import { getProvinces } from "@/actions/action"

export function useGeolocation() {
  const [isLocating, setIsLocating] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { departments, setProvinces, filter, filterChange } = useSearchStore()

  const handleMyLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("La geolocalización no es compatible con este navegador.", {
        style: { background: "#dc2626", color: "#fff", border: "none" }
      })
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const nominatimUrl = process.env.NEXT_PUBLIC_NOMINATIM_URL || 'https://nominatim.openstreetmap.org'
          const response = await fetch(
            `${nominatimUrl}/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          )

          if (!response.ok) throw new Error("Error en la geocodificación inversa")

          const data = await response.json()
          const address = data.address

          if (!address) {
            toast.error("No se pudo determinar la ubicación exacta.", {
              style: { background: "#dc2626", color: "#fff", border: "none" }
            })
            return
          }

          // Search for department
          const stateName = address.state || ""
          const regionName = address.region || ""

          const foundDept = departments.find(d =>
            stateName.toLowerCase().includes(d.name.toLowerCase()) ||
            d.name.toLowerCase().includes(stateName.toLowerCase()) ||
            regionName.toLowerCase().includes(d.name.toLowerCase()) ||
            d.name.toLowerCase().includes(regionName.toLowerCase())
          )

          if (foundDept) {
            // Load provinces for the found department
            const provinceData = await getProvinces(foundDept.id)
            setProvinces(provinceData)

            // Try to find the province
            const cityName = address.city || address.town || address.village || address.suburb || ""
            const foundProv = provinceData.find(p =>
              cityName.toLowerCase().includes(p.name.toLowerCase()) ||
              p.name.toLowerCase().includes(cityName.toLowerCase())
            )

            // Update filters
            const newFilter = {
              ...filter,
              department: foundDept.ubigeo.toString(),
              province: foundProv ? foundProv.ubigeo.toString() : ""
            }

            filterChange(newFilter)
            toast.success(`Ubicación detectada: ${foundDept.name}${foundProv ? `, ${foundProv.name}` : ""}`, {
              style: { background: "#16a34a", color: "#fff", border: "none" }
            })

            if (pathname !== '/') {
              router.push('/')
            }
          } else {
            toast.error("Ubicación fuera de la zona de cobertura (Perú).", {
              style: { background: "#dc2626", color: "#fff", border: "none" }
            })
          }
        } catch (error) {
          console.error("Error fetching location info:", error)
          toast.error("Error al obtener información de la ubicación.", {
            style: { background: "#dc2626", color: "#fff", border: "none" }
          })
        } finally {
          setIsLocating(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        toast.error("Error al obtener la ubicación actual.", {
          style: { background: "#dc2626", color: "#fff", border: "none" }
        })
        setIsLocating(false)
      }
    )
  }

  return {
    isLocating,
    handleMyLocation
  }
}
