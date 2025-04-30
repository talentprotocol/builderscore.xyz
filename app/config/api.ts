export const API_BASE_URL = process.env.TALENT_PROTOCOL_API_URL;
const API_KEY = process.env.TALENT_PROTOCOL_API_KEY;
export const NEYNAR_API_BASE_URL = process.env.NEYNAR_API_BASE_URL;
export const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export const ENDPOINTS = {
  sponsors: "/builder_grants/sponsors",
  leaderboards: "/builder_grants/leaderboards",
  grants: "/builder_grants/grants",
  talent: {
    socials: "/socials",
    profile: "/profile",
    builderScore: "/score",
  },
  neynar: {
    notificationTokens: "/v2/farcaster/frame/notification_tokens",
  },
} as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY!,
} as const;

export const NEYNAR_HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': NEYNAR_API_KEY!,
} as const; 