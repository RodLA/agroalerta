export interface SummaryData {
  lastUpdate: string
  totalAlerts: number
  totalCritical: number
  totalDepts: number
}

export interface Department {
  id: string
  ubigeo: number
  name: string
  metaInfo: {
    latitude: number
    longitude: number
    zoom: number
  }
}

export interface Province {
  id: string
  ubigeo: number
  name: string
}

export enum Risk {
  MUY_BAJO = "MUY_BAJO",
  BAJO = "BAJO",
  MEDIO = "MEDIO",
  ALTO = "ALTO",
  MUY_ALTO = "MUY_ALTO"
}

export interface Alert {
  id: string
  event: {
    id: string
    name: string
  }
  risk: Risk
  title: string
  summary: string
  crops: {
    id: string
    name: string
  }[]
  departments: string[]
  source: string
  riskDate: string
}
