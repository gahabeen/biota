// types
import { Fauna } from '~/../types/db';

export function Batch(fqlQueries: Fauna.Expr[]) {
  return fqlQueries;
}
