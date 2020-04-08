import { Fauna } from "~/../types/db";
// external
import { DB } from "~/db";

export async function query(this: DB, fqlQuery: Fauna.Expr) {
  return this.client.query(fqlQuery).then((res) => {
    // console.log(res);
    return res;
  });
}
