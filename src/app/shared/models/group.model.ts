import { DateTime } from 'luxon';
import { User } from './user.model';

export interface Group {
  id: number;
  name: string;
  token: string;
  winner: number;
  updated_at: DateTime;
  users: User[];
}
