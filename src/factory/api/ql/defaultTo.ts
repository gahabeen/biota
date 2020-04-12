import { query as q, Expr } from 'faunadb';

export const DefaultToOjbect = (value: Expr) => q.If(q.IsObject(value), value, {});
