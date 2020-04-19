import { Fauna, FaunaPaginateResponse, FaunaPaginateOptions, FaunaPaginateMapper } from '~/types/fauna';
import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';

export function* paginate(
  this: Biota,
  paginateQuery: Fauna.Expr,
  paginateOptions: FaunaPaginateOptions = {},
  mapper: FaunaPaginateMapper = q.Lambda(['x'], q.Get(q.Var('x'))),
) {
  const self = this;
  let after: any = Infinity;
  while (after) {
    yield execute(
      [
        {
          name: `Paginating your query`,
          task() {
            // FaunaPaginateResponse
            return self.query(q.Map(q.Paginate(paginateQuery, paginateOptions), mapper)).then((res: any) => {
              if (res.errors) {
                after = undefined;
                return Promise.reject(res);
              }
              if (res.after) {
                after = res.after;
              } else {
                after = undefined;
              }
              return res;
            });
          },
          fullError: true,
        },
      ],
      {
        singleResult: true,
        domain: 'Biota.paginate',
      },
    );
  }
}
