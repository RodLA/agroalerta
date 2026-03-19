export interface Crop {
  id: string;
  name: string;
}

export interface Source {
  site: string;
  siteName: string;
}

export interface LocationReport {
  id: number;
  risk: string;
  count: number;
}

export interface ReportData {
  crops: Crop[];
  sources: Source[];
  levels: string[];
  locations: Record<string, LocationReport[]>;
}

export interface ReportResponse {
  success: boolean;
  message: string;
  data: ReportData;
  timestamp: string;
}

export interface ReportFilters {
  department?: string;
  start?: string;
  end?: string;
}
