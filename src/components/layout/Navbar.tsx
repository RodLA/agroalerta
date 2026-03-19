"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Leaf, Search, Map as MapIcon, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { AdvancedFilterSheet } from "@/components/filters/AdvancedFilterSheet"
import { cn } from "@/lib/utils"
import { useGeolocation } from "@/hooks/useGeolocation"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const { isLocating, handleMyLocation } = useGeolocation()

  const handleSearchClick = () => {
    if (pathname.startsWith('/alerta')) {
      router.push('/')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Leaf className="h-6 w-6 text-green-600" />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-tight">AgroAlerta</span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Perú</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                handleSearchClick()
                setIsOpen(true)
              }}
            >
              <Search className="h-4 w-4" />
              Buscar
            </Button>

            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground"
              )}
            >
              Inicio
            </Link>

            <Link
              href="/mapa"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/mapa" ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground"
              )}
            >
              Mapa
            </Link>

            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={handleMyLocation}
              disabled={isLocating}
            >
              <MapPin className={cn("h-4 w-4 text-red-500", isLocating && "animate-pulse")} />
              {isLocating ? "Localizando..." : "Mi Ubicación"}
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                handleSearchClick()
                setIsOpen(true)
              }}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/mapa">
              <Button variant="ghost" size="icon">
                <MapIcon className="h-5 w-5" />
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleMyLocation}
              disabled={isLocating}
            >
              <MapPin className={cn("h-5 w-5 text-red-500", isLocating && "animate-pulse")} />
            </Button>
          </div>
        </div>

      </header>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <AdvancedFilterSheet onClose={() => setIsOpen(false)} />
      </Sheet>
    </>
  )
}
