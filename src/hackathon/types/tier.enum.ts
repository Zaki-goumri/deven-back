export const SPONSOR_TIER = {
  GOALD: 'goald',
  PLAT: 'plat',
  SILVER: 'silver',
  BRONZE: 'bronze',
} as const;

export type sponsorTier = (typeof SPONSOR_TIER)[keyof typeof SPONSOR_TIER];

export const SPONSOR_TIER_VALUES = Object.values(SPONSOR_TIER);
