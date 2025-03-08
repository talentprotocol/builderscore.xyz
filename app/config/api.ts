export const API_BASE_URL = process.env.TALENT_PROTOCOL_API_URL;
export const API_KEY = process.env.TALENT_PROTOCOL_API_KEY;

export const ENDPOINTS = {
  sponsors: '/v3/builder_grants/sponsors',
} as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY,
} as const; 