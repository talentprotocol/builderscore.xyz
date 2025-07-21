import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS: Record<
  string,
  number
> = {
  $TALENT: 0,
  ETH: 3,
  CELO: 0,
};

export const TOTAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS: Record<
  string,
  number
> = {
  $TALENT: 0,
  ETH: 0,
  CELO: 0,
};

export function formatNumber(x: number, decimals: number = 0): string {
  let navigatorLanguage = "en-US";

  if (typeof window !== "undefined") {
    navigatorLanguage = navigator.language;
  }

  const formattedAmount = new Intl.NumberFormat(navigatorLanguage, {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(x);

  return formattedAmount;
}

export function formatCompactNumber(x: number, forceDecimals?: number): string {
  const isNegative = x < 0;
  const absValue = Math.abs(x);

  if (absValue < 1000) {
    const decimals = forceDecimals !== undefined ? forceDecimals : 0;
    const formatted = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(absValue);
    return isNegative ? `-${formatted}` : formatted;
  }

  const units = ["", "K", "M", "B", "T"];
  const order = Math.floor(Math.log(absValue) / Math.log(1000));
  const unitname = units[Math.min(order, units.length - 1)];
  const num = absValue / Math.pow(1000, order);

  const decimals =
    forceDecimals !== undefined ? forceDecimals : order >= 2 ? 1 : 0;

  let navigatorLanguage = "en-US";

  if (typeof window !== "undefined") {
    navigatorLanguage = navigator.language;
  }

  const formatted =
    new Intl.NumberFormat(navigatorLanguage, {
      style: "decimal",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num) + unitname;

  return isNegative ? `-${formatted}` : formatted;
}

export const isEmptyOrInvisible = (str: string) => {
  if (!str) return true;
  // Remove zero-width characters: ZWSP, ZWNJ, ZWJ, BOM
  const cleaned = str.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
  return cleaned === "";
};

export function formatDate(
  date: string,
  options?: {
    month?: "long" | "short" | "narrow";
    day?: "numeric";
    year?: "numeric";
  },
): string {
  let dateObj;

  try {
    dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      if (date.includes("UTC")) {
        const cleanDate = date.replace("UTC", "").trim();
        dateObj = new Date(cleanDate);
      }
    }
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date Format";
    }
  } catch {
    return "Invalid Date Format";
  }

  return dateObj.toLocaleDateString("en-US", options);
}

export function formatChartDate(date: string): string {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
  } catch {
    return "Invalid Date";
  }
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  let formattedStartDate = "";
  const formattedEndDate = new Date(endDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (startYear !== endYear) {
    formattedStartDate = new Date(startDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } else {
    formattedStartDate = new Date(startDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  }

  return `${formattedStartDate} - ${formattedEndDate}`;
}

export function calculateDateRange(dateRange: string): {
  date_from: string;
  date_to: string;
} {
  const now = new Date();
  const date_to = now.toISOString().split("T")[0];

  if (dateRange === "max") {
    const date_from = new Date(0).toISOString().split("T")[0];
    return { date_from, date_to };
  }

  const days = parseInt(dateRange.replace("d", ""));
  const date_from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return { date_from, date_to };
}

export function aggregateChartData(
  chartData: Array<Record<string, string | number>>,
  interval: string,
  cumulativeFields: Set<string> = new Set(),
): Array<Record<string, string | number>> {
  if (!chartData || chartData.length === 0) return [];

  // For daily data, return as is
  if (interval === "d") {
    return chartData;
  }

  // Group data by the specified interval
  const grouped = chartData.reduce(
    (acc, dataPoint) => {
      const dateStr = dataPoint.date as string;
      const date = parseChartDate(dateStr);
      if (!date) return acc;

      let groupKey: string;

      switch (interval) {
        case "w": // Weekly - group by ISO week
          const weekStart = getWeekStart(date);
          groupKey = formatChartDate(weekStart.toISOString());
          break;
        case "m": // Monthly
          groupKey = formatChartDate(
            new Date(date.getFullYear(), date.getMonth(), 1).toISOString(),
          );
          break;
        case "q": // Quarterly
          const quarter = Math.floor(date.getMonth() / 3);
          groupKey = formatChartDate(
            new Date(date.getFullYear(), quarter * 3, 1).toISOString(),
          );
          break;
        case "y": // Yearly
          groupKey = formatChartDate(
            new Date(date.getFullYear(), 0, 1).toISOString(),
          );
          break;
        default:
          groupKey = dateStr;
      }

      if (!acc[groupKey]) {
        acc[groupKey] = { date: groupKey };
      }

      // Aggregate numeric values
      Object.keys(dataPoint).forEach((key) => {
        if (key !== "date" && typeof dataPoint[key] === "number") {
          if (cumulativeFields.has(key)) {
            // For cumulative fields, take the maximum value (latest cumulative total)
            acc[groupKey][key] = Math.max(
              (acc[groupKey][key] as number) || 0,
              dataPoint[key] as number,
            );
          } else {
            // For non-cumulative fields, sum them up
            acc[groupKey][key] =
              ((acc[groupKey][key] as number) || 0) +
              (dataPoint[key] as number);
          }
        }
      });

      return acc;
    },
    {} as Record<string, Record<string, string | number>>,
  );

  // Convert back to array and sort by date
  return Object.values(grouped).sort((a, b) => {
    const dateA = parseChartDate(a.date as string);
    const dateB = parseChartDate(b.date as string);
    if (!dateA || !dateB) return 0;
    return dateA.getTime() - dateB.getTime();
  });
}

// Helper function to parse chart date format (DD/MM/YY)
function parseChartDate(dateStr: string): Date | null {
  try {
    const [day, month, year] = dateStr.split("/");
    const fullYear = parseInt(year) + (parseInt(year) > 50 ? 1900 : 2000);
    return new Date(fullYear, parseInt(month) - 1, parseInt(day));
  } catch {
    return null;
  }
}

// Helper function to get the start of the week (Monday)
function getWeekStart(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(date.setDate(diff));
}

export function getTimeRemaining(endDate: string): string {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Ended";
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h`;
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else {
    return `${diffMinutes}m`;
  }
}

export function capitalize(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const isMobile = (userAgent: string): boolean => {
  return /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
};
