import { Expr } from 'faunadb';
import { FaunaString } from '../fauna';

export interface RoleTestDefinition {
  action?: FaunaString;
  inputs?: Expr[];
}
