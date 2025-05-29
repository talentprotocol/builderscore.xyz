export interface ProfileData {
  date: string;
  count: number;
}

export interface ProfilesData {
  base_basename: ProfileData[];
  ens: ProfileData[];
  farcaster: ProfileData[];
}

export interface ChartSeries {
  left: ChartSeriesItem[];
  right: ChartSeriesItem[];
}

export interface ChartSeriesItem {
  key: string;
  name: string;
  color: string;
  type: "line" | "column" | "stacked-column" | "area";
}

export interface DataPoint {
  [key: string]: string | number;
}

export interface DataPointDefinition {
  data_provider: string;
  name: string;
  uom: string;
}
