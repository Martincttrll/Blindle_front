import { DateTime } from 'luxon';

export interface Group {
  id: number;
  name: string;
  token: string;
  winner: number;
  updated_at: DateTime;
}
