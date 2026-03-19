import { Risk } from "@/types/metrics"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  const day = date.getDate()
  const months = [
    "Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.",
    "Jul.", "Ago.", "Sep.", "Oct.", "Nov.", "Dic."
  ]
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  // const seconds = date.getSeconds().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'p.m.' : 'a.m.'

  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'

  return `${day} de ${month} ${year}, ${hours}:${minutes} ${ampm}`
}

export function riskToDisplay(risk: Risk): string {
  switch (risk) {
    case Risk.MUY_BAJO:
      return "Muy Bajo"
    case Risk.BAJO:
      return "Bajo"
    case Risk.MEDIO:
      return "Medio"
    case Risk.ALTO:
      return "Alto"
    case Risk.MUY_ALTO:
      return "Muy Alto"
    default:
      return risk
  }
}