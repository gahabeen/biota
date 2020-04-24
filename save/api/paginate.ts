// types
import { Fauna, FaunaPaginateResponse, FaunaPaginateOptions } from '~/../types/fauna';
// external
import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';

export function* paginate(this: Biota, paginateQuery: Fauna.Expr, paginateOptions: FaunaPaginateOptions = {}) {
  let after: any = Infinity;
  while (after) {
    yield execute(
      [
        {
          name: `Paginating your query`,
          task() {
            return this.client.query(q.Paginate(paginateQuery, paginateOptions)).then((res: FaunaPaginateResponse) => {
              if (res.after) {
                after = res.after;
              } else {
                after = undefined;
              }
              return res;
            });
          },
        },
      ],
      {
        singleResult: true,
        domain: 'Biota.paginate',
      },
    );
  }
}
