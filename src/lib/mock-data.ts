export type RiskLevel = 'Muy Bajo' | 'Bajo' | 'Medio' | 'Alto' | 'Muy Alto';

export interface Alert {
  id: string;
  type: string;
  risk: RiskLevel;
  departments: string[];
  provinces: string[];
  title: string;
  description: string;
  detailedInfo: string;
  crops: string[];
  date: string; // yyyy-MM
  source: string;
  recommendations: string[];
  coordinates: [number, number]; // [lat, lng]
}

export const DEPARTMENTS = [
  "Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco",
  "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Loreto",
  "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"
];

export const PROVINCES_BY_DEPT: Record<string, string[]> = {
  "Junín": ["Huancayo", "Concepción", "Chanchamayo", "Jauja", "Junín", "Satipo", "Tarma", "Yauli", "Chupaca"],
  "Huánuco": ["Huánuco", "Ambo", "Dos de Mayo", "Huacaybamba", "Huamalíes", "Leoncio Prado", "Marañón", "Pachitea", "Puerto Inca", "Lauricocha", "Yarowilca"],
  "Pasco": ["Pasco", "Daniel Alcides Carrión", "Oxapampa"],
  "Cusco": ["Cusco", "Acomayo", "Anta", "Calca", "Canas", "Canchis", "Chumbivilcas", "Espinar", "La Convención", "Paruro", "Paucartambo", "Quispicanchi", "Urubamba"],
  "Puno": ["Puno", "Azángaro", "Carabaya", "Chucuito", "El Collao", "Huancané", "Lampa", "Melgar", "Moho", "San Antonio de Putina", "San Román", "Sandia", "Yunguyo"],
};

export const ALERTS: Alert[] = [
  {
    id: "1",
    type: "Precipitación",
    risk: "Muy Alto",
    departments: ["Junín", "Huánuco", "Pasco"],
    provinces: ["Huancayo", "Leoncio Prado", "Pasco"],
    title: "Lluvias Intensas en la Selva Central",
    description: "Se prevén precipitaciones de fuerte intensidad acompañadas de descargas eléctricas y ráfagas de viento.",
    detailedInfo: "El fenómeno climático afectará principalmente las zonas de selva alta y media. Se esperan acumulados de lluvia superiores a los 50mm/día. Esto podría generar deslizamientos de tierra y aumento del caudal de los ríos.",
    crops: ["Café", "Cacao", "Cítricos"],
    date: "2026-03",
    source: "SENAMHI",
    recommendations: [
      "Reforzar techos y limpiar canaletas.",
      "Identificar rutas de evacuación ante posibles huaicos.",
      "Evitar realizar labores agrícolas en laderas pronunciadas.",
      "Proteger almacenes de semillas y fertilizantes de la humedad."
    ],
    coordinates: [-11.1583, -75.3283] // Satipo area
  },
  {
    id: "2",
    type: "Helada",
    risk: "Alto",
    departments: ["Puno", "Cusco"],
    provinces: ["Azángaro", "Espinar"],
    title: "Descenso de Temperatura en Zona Altiplánica",
    description: "Temperaturas nocturnas caerán por debajo de los 0°C en zonas sobre los 3800 msnm.",
    detailedInfo: "Masa de aire seco favorecerá el descenso brusco de temperatura durante la madrugada. Se recomienda especial cuidado con los cultivos de panllevar y el ganado.",
    crops: ["Papa", "Quinua", "Cebada"],
    date: "2026-03",
    source: "SENAMHI",
    recommendations: [
      "Implementar cobertizos para el ganado.",
      "Utilizar fertilizantes foliares para fortalecer las plantas contra el frío.",
      "Evitar el riego por inundación en horas de la tarde.",
      "Almacenar forraje seco."
    ],
    coordinates: [-15.1311, -70.1834] // Azangaro
  },
  {
    id: "3",
    type: "Sequía",
    risk: "Medio",
    departments: ["Áncash", "La Libertad"],
    provinces: ["Huaraz", "Santiago de Chuco"],
    title: "Déficit Hídrico en Sierra Norte",
    description: "Ausencia prolongada de lluvias afecta la disponibilidad de agua para riego.",
    detailedInfo: "Se registra un retraso en el inicio del periodo de lluvias estacionales, lo que compromete las siembras de campaña grande.",
    crops: ["Maíz", "Trigo"],
    date: "2026-02",
    source: "ANA",
    recommendations: [
      "Optimizar el uso del agua mediante riego tecnificado.",
      "Priorizar cultivos de ciclo corto.",
      "Reparar canales de riego para evitar fugas.",
      "Monitorear la humedad del suelo."
    ],
    coordinates: [-9.527, -77.527] // Huaraz
  },
  {
    id: "4",
    type: "Inundación",
    risk: "Muy Alto",
    departments: ["Loreto", "Ucayali"],
    provinces: ["Maynas", "Coronel Portillo"],
    title: "Desborde de Río Amazonas",
    description: "Nivel del río ha superado el umbral rojo de inundación.",
    detailedInfo: "Las lluvias persistentes en las cabeceras han provocado un aumento crítico en el caudal. Se prevé afectación en zonas ribereñas bajas.",
    crops: ["Arroz", "Plátano", "Yuca"],
    date: "2026-03",
    source: "SENAMHI",
    recommendations: [
      "Evacuar zonas bajas inundables.",
      "Asegurar embarcaciones y ganado.",
      "Cosechar productos maduros de inmediato.",
      "Mantenerse informado por radios locales."
    ],
    coordinates: [-3.749, -73.253] // Iquitos
  }
];

export const METRICS = {
  totalAlerts: 42,
  criticalAlerts: 12,
  affectedDepts: 18,
  lastUpdate: "2026-02-20T23:29:11"
};

export const CROPS = ["Café", "Cacao", "Cítricos", "Papa", "Quinua", "Cebada", "Maíz", "Trigo", "Arroz", "Plátano", "Yuca"];
export const EVENT_TYPES = ["Precipitación", "Helada", "Sequía", "Inundación", "Viento Fuerte", "Granizada"];