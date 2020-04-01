// types
// external
import * as fauna from "faunadb";
const q = fauna.query;

export function Identity() {
  return q.If(q.HasIdentity(), q.Identity(), null);
}
