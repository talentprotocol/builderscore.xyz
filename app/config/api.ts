export const API_BASE_URL = process.env.TALENT_PROTOCOL_API_URL;
const API_KEY = process.env.TALENT_PROTOCOL_API_KEY;

export const ENDPOINTS = {
  sponsors: '/builder_grants/sponsors',
  leaderboards: '/builder_grants/leaderboards',
  grants: '/builder_grants/grants',
  talent: {
    profile: '/api/v2/search/advanced/passport_app__passports',
    credentials: '/api/v1/passport_credentials',
  },
} as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY!,
} as const; 