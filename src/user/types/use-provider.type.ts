export const UserProvider = {
  GOOGLE: 'google',
  GITHUB: 'github',
} as const;

export type UserProviderType = (typeof UserProvider)[keyof typeof UserProvider];
