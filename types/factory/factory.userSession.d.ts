import { Expr } from 'faunadb';
import { FaunaString, FaunaRef } from 'types/fauna';

export type FactoryUserSession = (idOrRefOrUser: FaunaString | FaunaRef) => FactoryUserSessionApi;

export interface FactoryUserSessionApi {}
