import { StrategyOptionsWithRequest as StrategyOptionsGoogle } from 'passport-google-oauth20';
import { StrategyOptionsWithRequest as StrategyOptionsGitHub } from 'passport-github2';

export interface AuthConfig {
  jwt: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpiresIn: number; // in seconds
    refreshTokenExpiresIn: number; // in seconds
  };
  oauth: {
    google: StrategyOptionsGoogle;
    github: StrategyOptionsGitHub;
  };
}
