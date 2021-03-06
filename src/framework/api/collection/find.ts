import { query as q } from 'faunadb';
import * as qs from 'querystring';
import { Fauna, FaunaPaginateMapper, FaunaPaginateOptions } from '~/types/fauna';
import { FrameworkCollectionSearchParams } from '~/types/framework/framework.collection';
import { Biota } from '~/biota';
import { Identity } from '~/factory/api/ql';
import { BiotaFunctionName } from '~/factory/constructors/udfunction';
import { execute } from '~/tools/tasks';

export function parseSearchQuery(collection: string, searchQuery: object) {
  const buildQuery = (sq: Fauna.Expr) => {
    return q.Call(BiotaFunctionName('SearchQuery'), Identity(), q.Collection(collection), sq);
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
          name: `Find (${qs.stringify(searchQuery).slice(0, 20)}...) in (${collectionName})`,
          task() {
            const paginate = q.Paginate(parseSearchQuery(collectionName, searchQuery), paginateOptions);
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
