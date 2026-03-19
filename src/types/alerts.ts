export interface Crop {
  id: string;
  name: string;
}

export interface Province {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
  provinces: Province[];
}

export interface Source {
  document: string;
  title: string;
  url: string;
  discoveredAt: string;
  site: string;
  siteName: string;
}

export interface Event {
  id: string;
  name: string;
}

export interface Recommendation {
  id: string;
  domain: string;
  reco: string;
}

export interface AlertDetail {
  id: string;
  pdfKey: string;
  source: Source;
  processedAt: string;
  riskDate: string;
  crops: Crop[];
  risk: string;
  event: Event;
  departmentIds: number[];
  provinceIds: number[];
  departments: Department[];
  title: string;
  description: string;
  summary: string;
  recommendations: Recommendation[];
}
