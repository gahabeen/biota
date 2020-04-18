import { FaunaTime } from '../fauna';
import { Expr } from 'faunadb';

export type FactoryAt = (time: FaunaTime) => Expr;
