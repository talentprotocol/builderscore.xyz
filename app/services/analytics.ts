import fs from "fs";
import path from "path";
import { parseCSV, CSVRow } from "../lib/csv-parser";

const dataDir = path.join(process.cwd(), "app/data/base");

export interface MetricsTotals {
  date: string;
  eligibleDevs: number;
  activeDevs: number;
  rewardedDevs: number;
  activeContractDevs: number;
  deployedContractDevs: number;
}

export interface CSVDataResult {
  activation: CSVRow[];
  growth: CSVRow[];
  retention: CSVRow[];
  developerActivity: CSVRow[];
  dailyActivity: CSVRow[];
  weeklyActivity: CSVRow[];
  activityByType: CSVRow[];
  rewardsBreakdown: CSVRow[];
  winnersProfile: CSVRow[];
  topBuilders: CSVRow[];
  metricsTotals: MetricsTotals;
  summaryText: string;
}

export async function getCSVData(): Promise<CSVDataResult> {
  const activationCSV = fs.readFileSync(
    path.join(dataDir, "rewards_sponsor_metrics_activation_rate.csv"),
    "utf-8",
  );

  const growthCSV = fs.readFileSync(
    path.join(dataDir, "rewards_sponsor_metrics_growth.csv"),
    "utf-8",
  );

  const retentionCSV = fs.readFileSync(
    path.join(dataDir, "rewards_sponsor_metrics_retention.csv"),
    "utf-8",
  );

  const developerActivityCSV = fs.readFileSync(
    path.join(dataDir, "rewards_sponsor_metrics_developer_activity.csv"),
    "utf-8",
  );

  const dailyActivityCSV = fs.readFileSync(
    path.join(dataDir, "rewards_sponsor_metrics_daily_activity.csv"),
    "utf-8",
  );

  const weeklyActivityCSV = fs.readFileSync(
    path.join(dataDir, "rewards_sponsor_metrics_weekly_activity.csv"),
    "utf-8",
  );

  const activityByTypeCSV = fs.readFileSync(
    path.join(dataDir, "rewards_sponsor_metrics_activity_by_type.csv"),
    "utf-8",
  );

  const rewardsBreakdownCSV = fs.readFileSync(
    path.join(dataDir, "rewards_sponsor_metrics_rewards_breakdown.csv"),
    "utf-8",
  );

  const winnersProfileCSV = fs.readFileSync(
    path.join(dataDir, "rewards_sponsor_metrics_winners_profile.csv"),
    "utf-8",
  );

  const topBuildersCSV = fs.readFileSync(
    path.join(dataDir, "rewards_sponsor_metrics_top_builders.csv"),
    "utf-8",
  );

  const metricsCSV = fs.readFileSync(
    path.join(dataDir, "rewards_sponsor_metrics_totals.csv"),
    "utf-8",
  );

  const summaryText = fs.readFileSync(
    path.join(dataDir, "rewards_sponsor_metrics_summary_of_summaries.txt"),
    "utf-8",
  );

  const activation = parseCSV(activationCSV);
  const growth = parseCSV(growthCSV);
  const retention = parseCSV(retentionCSV);
  const developerActivity = parseCSV(developerActivityCSV);
  const dailyActivity = parseCSV(dailyActivityCSV);
  const weeklyActivity = parseCSV(weeklyActivityCSV);
  const activityByType = parseCSV(activityByTypeCSV);
  const rewardsBreakdown = parseCSV(rewardsBreakdownCSV);
  const winnersProfile = parseCSV(winnersProfileCSV);
  const topBuilders = parseCSV(topBuildersCSV);

  const parseMetricsTotals = (csvData: string): MetricsTotals => {
    const lines = csvData.trim().split("\n");
    if (lines.length < 2) {
      throw new Error("Invalid metrics data: less than 2 lines found");
    }

    const dataLine = lines[1];

    const parseCSVLine = (line: string): string[] => {
      const values: string[] = [];
      let currentValue = "";
      let insideQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
          values.push(currentValue);
          currentValue = "";
        } else {
          currentValue += char;
        }
      }

      values.push(currentValue);
      return values;
    };

    const values = parseCSVLine(dataLine);

    if (values.length < 6) {
      console.error("CSV values:", values);
      throw new Error(
        `Invalid metrics data: expected at least 6 values, got ${values.length}`,
      );
    }

    return {
      date: values[0].trim(),
      eligibleDevs: parseInt(values[1] || "0"),
      activeDevs: parseInt(values[2] || "0"),
      rewardedDevs: parseInt(values[3] || "0"),
      activeContractDevs: parseInt(values[4] || "0"),
      deployedContractDevs: parseInt(values[5] || "0"),
    };
  };

  let metricsTotals: MetricsTotals;
  try {
    metricsTotals = parseMetricsTotals(metricsCSV);
  } catch (error) {
    console.error("Error parsing metrics totals:", error);
    metricsTotals = {
      date: new Date().toISOString(),
      eligibleDevs: 0,
      activeDevs: 0,
      rewardedDevs: 0,
      activeContractDevs: 0,
      deployedContractDevs: 0,
    };
  }

  return {
    activation,
    growth,
    retention,
    developerActivity,
    dailyActivity,
    weeklyActivity,
    activityByType,
    rewardsBreakdown,
    winnersProfile,
    topBuilders,
    metricsTotals,
    summaryText,
  };
}
