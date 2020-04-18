import { Fauna, FaunaPaginateResponse, FaunaPaginateOptions, FaunaPaginateMapper } from '~/types/fauna';
import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';

export function* paginate(this: Biota, paginateQuery: Fauna.Expr, paginateOptions: FaunaPaginateOptions = {}, mapper: FaunaPaginateMapper) {
  let after: any = Infinity;
  while (after) {
    yield execute(
      [
        {
          name: `Paginating your query`,
          task() {
            return this.query(q.Map(q.Paginate(paginateQuery, paginateOptions), mapper)).then((res: FaunaPaginateResponse) => {
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
