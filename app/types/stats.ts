export interface StatsQueryParams {
  metrics: string[];
  cumulative?: boolean;
  date_from?: string;
  date_to?: string;
}

export interface StatsDataPoint {
  date: string;
  value: number;
}

export interface StatsResponse {
  [metric: string]: StatsDataPoint[];
}
