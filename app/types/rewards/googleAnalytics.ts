export interface GoogleAnalyticsActiveUserData {
  date: string;
  activeUsers: number;
}

export interface GoogleAnalyticsApiResponse {
  success: boolean;
  data: GoogleAnalyticsActiveUserData[];
  error?: string;
}
