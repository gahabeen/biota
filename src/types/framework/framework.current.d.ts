import { FaunaPaginateOptions, FaunaPaginateMapper, FaunaString, FaunaDatabaseOptions, FaunaTime, FaunaNumber } from '~/types/fauna';
import { Expr } from 'faunadb';

export interface FrameworkCurrentUserApi {
  _empty: string;
}

export interface FrameworkCurrentSessionsApi {
  _empty: string;
}

export interface FrameworkCurrentApi {
  user: FrameworkCurrentUserApi;
  session: FrameworkCurrentSessionsApi;
}
