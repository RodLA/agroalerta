import Link from "next/link"
import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-green-700 text-primary-foreground">
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-white" />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-tight">AgroAlerta</span>
                <span className="text-[10px] font-medium text-primary-foreground/70 uppercase tracking-widest">Perú</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 max-w-xs">
              Plataforma de vigilancia agroclimática para el fortalecimiento de la resiliencia del sector agrario en el Perú.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">Fuentes Oficiales</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="#" className="hover:text-white transition-colors">SENAMHI</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">ANA (Autoridad Nacional del Agua)</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">INIA</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">MIDAGRI</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio / Dashboard</Link></li>
              <li><Link href="/mapa" className="hover:text-white transition-colors">Mapa Interactivo</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Alertas suscritas</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Glosario Climático</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">Contacto y Ayuda</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="#" className="hover:text-white transition-colors">Centro de Ayuda</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Términos de Uso</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Soporte Técnico</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60">
          <p>© 2026 AgroAlerta Perú. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:underline hover:text-white">Privacidad</Link>
            <Link href="#" className="hover:underline hover:text-white">Términos</Link>
            <Link href="#" className="hover:underline hover:text-white">Ayuda</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
