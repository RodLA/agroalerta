import Link from "next/link"
import { FileText, Clock, Globe, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Source } from "@/types/alerts"

interface AlertDetailSourceProps {
  source: Source
  discoveredDate: string
  processedDate: string
}

export function AlertDetailSource({ source, discoveredDate, processedDate }: AlertDetailSourceProps) {
  return (
    <Card className="border-none shadow-xl shadow-slate-900/20 bg-slate-900 text-white overflow-hidden pt-0 gap-0">
      <div className="h-2 w-full bg-primary" />
      <CardHeader className="p-6 pt-6">
        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Credenciales de Información</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6 pb-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ente Emisor</span>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-primary font-bold text-xl">
              {source.site.charAt(0)}
            </div>
            <div>
              <span className="font-black text-lg block leading-tight">{source.siteName}</span>
              <span className="text-xs text-slate-400">{source.site}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 py-6 border-y border-slate-800">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Documento Oficial</span>
              <span className="font-bold text-sm tracking-tight">{source.document}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Descubierto</span>
              <span className="text-sm font-medium">{discoveredDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Procesado</span>
              <span className="text-sm font-medium">{processedDate}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Link href={source.url} target="_blank" className="block w-full">
            <Button className="w-full bg-white hover:bg-slate-200 text-slate-900 font-black gap-2 transition-all">
              <Globe className="h-4 w-4" />
              VER FUENTE ORIGINAL
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
