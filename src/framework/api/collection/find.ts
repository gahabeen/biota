import { query as q, Expr } from 'faunadb';
import { Biota } from '~/biota';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';
import { Fauna, FaunaPaginateMapper, FaunaPaginateOptions } from '~/types/fauna';
import { FrameworkCollectionSearchParams } from '~/types/framework/framework.collection';

export function parseSearchQuery(context: Expr, collection: string, searchQuery: object) {
  const buildQuery = (searchTerms: Fauna.Expr) => {
    return indexes(context).searchQuery(q.Collection(collection), searchTerms);
    // return q.Call(BiotaFunctionName('SearchQuery'), Identity(), q.Collection(collection), sq);
  };

  // const safe = (x: object) => JSON.parse(JSON.stringify(x));

  const operators = {
    $and: (...queries: Fauna.Expr[]) => {
      return q.Intersection(...queries.map(buildQuery));
    },
    $or: (...queries: Fauna.Expr[]) => {
      return q.Union(...queries.map(buildQuery));
    },
    $nor: (query: Fauna.Expr, ...queries: Fauna.Expr[]) => {
      return q.Difference(buildQuery(query), ...queries.map(buildQuery));
    },
    // $not: (source: Fauna.Expr, query: Fauna.Expr) =>
    //   q.Difference(source, query)
    // $distinct: (queries: Fauna.Expr[]) => q.Distinct(queries)
  };

  const isSystemOperator = (key: string) => Object.keys(operators).includes(key);
  const hasSystemOperators = (obj: object) => Object.keys(obj).some((key) => Object.keys(operators).includes(key));
  const getFirstSystemOperator = (obj: object) => {
    return Object.keys(obj).find((key) => isSystemOperator(key));
  };

  // UPDATE!
  const reducer = (obj: object) => {
    const reduced = {};
    const reducee = (value: any, acc: object) => {
      if (typeof value === 'object') {
        if (hasSystemOperators(value)) {
          const operator = getFirstSystemOperator(value);
          const operatorValue = value[operator];
          const operation = operators[operator](...operatorValue);
          Object.assign(acc, operation);
        } else {
          for (const key of Object.keys(value)) {
            acc[key] = {};
            reducee(value[key], acc[key]);
          }
        }
      } else if (Array.isArray(value)) {
        acc = (value as []).map((item: any) => {
          if (typeof item === 'object' || Array.isArray(item)) {
            return reducer(item);
          } else {
            return item;
          }
        });
      } else {
        acc = value;
      }
    };

    reducee(obj, reduced);
    return reduced;
  };

  if (!searchQuery) {
    return q.Documents(q.Collection(collection));
  }

  if (!hasSystemOperators(searchQuery)) {
    return buildQuery(searchQuery);
  } else {
    return reducer(searchQuery);
  }
}

export function find(this: Biota, collectionName: string) {
  const self = this;

  return async function findMethod(
    searchQuery: FrameworkCollectionSearchParams,
    paginateOptions: FaunaPaginateOptions = {},
    mapper: FaunaPaginateMapper = q.Lambda('x', q.Get(q.Var('x'))),
  ) {
    return execute(
      [
        {
          // (${qs.stringify(searchQuery).slice(0, 20)}...)
          name: `Find (...) in (${collectionName})`,
          task() {
            const paginate = q.Paginate(parseSearchQuery(self.context, collectionName, searchQuery), paginateOptions);
            return self.query(mapper ? q.Map(paginate, mapper) : paginate);
          },
        },
      ],
      {
        domain: 'Biota.collection.find',
      },
    );
  };
}
