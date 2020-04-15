import { Fauna } from '~/../types/db';
import { Biota } from '~/biota';

export async function query(this: Biota, fqlQuery: Fauna.Expr) {
  return this.client.query(fqlQuery).then((res) => {
    // console.log(res);
    return res;
  });
}
