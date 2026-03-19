"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, Play, Pause, Square, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AlertDetailTTSProps {
  text: string
}

export function AlertDetailTTS({ text }: AlertDetailTTSProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      utteranceRef.current = new SpeechSynthesisUtterance(text)
      utteranceRef.current.lang = "es-ES"
      utteranceRef.current.rate = 0.9 // Un poco más lento para claridad

      utteranceRef.current.onstart = () => setIsPlaying(true)
      utteranceRef.current.onend = () => {
        setIsPlaying(false)
        setIsPaused(false)
      }
      utteranceRef.current.onerror = () => {
        setIsPlaying(false)
        setIsPaused(false)
      }

      // Intentar auto-reproducción (puede ser bloqueado por el navegador)
      const timer = setTimeout(() => {
        handlePlay()
      }, 1000)

      return () => {
        clearTimeout(timer)
        window.speechSynthesis.cancel()
      }
    } else {
      setIsSupported(false)
    }
  }, [text])

  const handlePlay = () => {
    if (!utteranceRef.current) return

    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      setIsPlaying(true)
    } else {
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utteranceRef.current)
    }
  }

  const handlePause = () => {
    window.speechSynthesis.pause()
    setIsPaused(true)
    setIsPlaying(false)
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }

  if (!isSupported) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Etiqueta flotante informativa */}
      {isPlaying && (
        <div className="bg-slate-900/90 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full shadow-2xl animate-bounce pointer-events-auto uppercase tracking-widest border border-white/10">
          Escuchando Alerta...
        </div>
      )}

      <div className="flex items-center gap-2 pointer-events-auto">
        {isPlaying || isPaused ? (
          <>
            <Button
              size="icon"
              variant="outline"
              onClick={handleStop}
              className="h-10 w-10 rounded-full bg-white shadow-xl border-slate-200 hover:bg-slate-50 text-slate-600 transition-all hover:scale-110"
              title="Detener"
            >
              <Square className="h-4 w-4 fill-current" />
            </Button>
            
            <Button
              size="icon"
              onClick={isPlaying ? handlePause : handlePlay}
              className={cn(
                "h-14 w-14 rounded-full shadow-2xl transition-all hover:scale-110",
                isPlaying ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
              )}
              title={isPlaying ? "Pausar" : "Reanudar"}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 fill-current" />
              ) : (
                <Play className="h-6 w-6 fill-current ml-1" />
              )}
            </Button>
          </>
        ) : (
          <Button
            size="icon"
            onClick={handlePlay}
            className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl transition-all hover:scale-110 group relative overflow-hidden"
            title="Escuchar Alerta"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-16 group-hover:translate-y-0 transition-transform duration-300" />
            <Volume2 className="h-8 w-8 relative z-10" />
          </Button>
        )}
      </div>
    </div>
  )
}
