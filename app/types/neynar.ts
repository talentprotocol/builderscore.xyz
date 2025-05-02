export interface NotificationToken {
  object: string;
  url: string;
  token: string;
  status: "enabled" | "disabled";
  fid: number;
  created_at: string;
  updated_at: string;
}

export interface NotificationTokensResponse {
  notification_tokens: NotificationToken[];
  next?: {
    cursor: string | null;
  };
}

export interface NotificationTokensApiResponse {
  success: boolean;
  data: NotificationTokenData[];
  cumulativeData: CumulativeNotificationData[];
  raw?: NotificationToken[];
  error?: string;
}

export interface NotificationTokenData {
  date: string;
  enabled: number;
  disabled: number;
  total: number;
  enabledPercentage: number;
}

export interface CumulativeNotificationData {
  date: string;
  cumulativeEnabled: number;
}

export interface NotificationTokensParams {
  limit?: number;
  fids?: number[];
  cursor?: string;
}

export interface NotificationPayload {
  token: string;
  message: string;
  url?: string;
  title?: string;
  icon_url?: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
}
