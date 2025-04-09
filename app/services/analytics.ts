import fs from 'fs';
import path from 'path';
import { parseCSV, CSVRow } from '../lib/csv-parser';

const dataDir = path.join(process.cwd(), 'app/data/base');

export interface CSVDataResult {
  activation: CSVRow[];
  growth: CSVRow[];
  retention: CSVRow[];
  developerActivity: CSVRow[];
  summaryText: string;
}

export async function getCSVData(): Promise<CSVDataResult> {
  // Read CSV files
  const activationCSV = fs.readFileSync(
    path.join(dataDir, 'rewards_sponsor_metrics_activation_rate.csv'),
    'utf-8'
  );
  
  const growthCSV = fs.readFileSync(
    path.join(dataDir, 'rewards_sponsor_metrics_growth.csv'),
    'utf-8'
  );
  
  const retentionCSV = fs.readFileSync(
    path.join(dataDir, 'rewards_sponsor_metrics_retention.csv'),
    'utf-8'
  );
  
  const developerActivityCSV = fs.readFileSync(
    path.join(dataDir, 'rewards_sponsor_metrics_developer_activity.csv'),
    'utf-8'
  );
  
  const summaryText = fs.readFileSync(
    path.join(dataDir, 'rewards_sponsor_metrics_summary_of_summaries.txt'),
    'utf-8'
  );
  
  // Parse the CSV data
  const activation = parseCSV(activationCSV);
  const growth = parseCSV(growthCSV);
  const retention = parseCSV(retentionCSV);
  const developerActivity = parseCSV(developerActivityCSV);
  
  return {
    activation,
    growth,
    retention,
    developerActivity,
    summaryText
  };
} 