export type StatsQuery = {
  metrics: string[];
};

export type StatsResponse = {
  [key: string]: {
    [key: string]: {
      date: string;
      count: number;
    }[];
  };
};
