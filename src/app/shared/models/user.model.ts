import { DateTime } from "luxon";

export interface User {
  id: number;
  name: string;
  email?: string;
  email_verified_at?: string;
  nbWin: number;
  nbGame: number;
  idSpotify: string;
  avatar?: string;
  points?: number;
  alreadyGuess?: Array<string>;
  spotifyAccessToken: string;
  spotifyRefreshToken: string;
  spotifyExpiresIn: number;
  updated_at: DateTime;
  created_at: DateTime;
}
