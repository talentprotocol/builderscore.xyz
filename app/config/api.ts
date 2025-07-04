export const API_BASE_URL = process.env.TALENT_PROTOCOL_API_URL;
const API_KEY = process.env.TALENT_PROTOCOL_API_KEY;
export const NEYNAR_API_BASE_URL = process.env.NEYNAR_API_BASE_URL;
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
export const DEBUG_VIEW_UNLOCK_WORD = process.env.DEBUG_VIEW_UNLOCK_WORD || "";

export const ENDPOINTS = {
  sponsors: "/builder_grants/sponsors",
  leaderboards: "/builder_grants/leaderboards",
  grants: "/builder_grants/grants",
  talent: {
    socials: "/socials",
    profile: "/profile",
    builderScore: "/score",
    accounts: "/accounts",
    credentials: "/credentials",
    credentialsDatapoints: "/data_points",
    searchProfiles: "/search/advanced/profiles",
    statsDaily: "/stats/daily",
  },
  neynar: {
    notificationTokens: "/v2/farcaster/frame/notification_tokens",
  },
  localApi: {
    builderRewards: {
      leaderboards: "/api/leaderboards",
    },
    talent: {
      profile: "/api/talent/profile",
      lookup: "/api/talent/lookup",
      grants: "/api/grants",
      leaderboards: "/api/leaderboards",
      leaderboardEntry: "/api/leaderboards/entry",
      sponsors: "/api/sponsors",
      searchProfiles: "/api/search/profiles",
      searchAdvancedMetadataFields: "/api/search/advanced/metadata/fields",
      searchAdvancedDocuments: "/api/search/advanced/documents",
      searchAdvanced: "/api/search/advanced",
      statsDailyMetrics: "/api/stats/daily/metrics",
      statsDaily: "/api/stats/daily",
    },
    neynar: {
      notificationTokens: "/api/neynar/notification_tokens",
    },
    analytics: {
      activeUsers: "/api/analytics/active_users",
      topBuilders: "/api/analytics/top_builders",
      csvData: "/api/analytics/csv_data",
    },
    revalidate: {
      all: "/api/revalidate",
    },
  },
} as const;

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "X-API-KEY": API_KEY!,
} as const;

export const NEYNAR_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": NEYNAR_API_KEY!,
} as const;
