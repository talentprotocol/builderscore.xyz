export interface ChartSeries {
  left: ChartSeriesItem[];
  right: ChartSeriesItem[];
}

export interface ChartSeriesItem {
  key: string;
  name: string;
  dataProvider: string;
  color: string;
  type: "line" | "column" | "stacked-column" | "area";
  cumulative: boolean;
}

export interface DataPoint {
  [key: string]: string | number;
}

export interface DataPointDefinition {
  data_provider: string;
  name: string;
  uom: string;
}
