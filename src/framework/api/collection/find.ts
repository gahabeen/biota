import { query as q } from 'faunadb';
import * as qs from 'querystring';
import { Fauna, FaunaCollectionOptions, FaunaPaginateMapper, FaunaPaginateOptions } from '~/../types/fauna';
import { DBFrameworkCollectionSearchParams } from '~/../types/framework/framework.collection';
import { DB } from '~/db';
import { udfunctionNameNormalized } from '~/factory/classes/udfunction';
import { execute } from '~/tasks';
import { Identity } from '~/factory/api/ql';

export function parseSearchQuery(collection: string, searchQuery: object) {
  const buildQuery = (sq: Fauna.Expr) => {
    return q.Call(udfunctionNameNormalized('SearchQuery'), Identity(), q.Collection(collection), sq);
  };

  // const safe = (x: object) => JSON.parse(JSON.stringify(x));

  const operators = {
    $and: (...queries: Fauna.Expr[]) => {
      return q.Intersection(...queries.map(buildQuery));
    },
    $or: (...queries: Fauna.Expr[]) => {
      console.log('queries', queries);
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
    let reduced = {};
    const reducee = (value: any, acc: object) => {
      if (typeof value === 'object') {
        if (hasSystemOperators(value)) {
          let operator = getFirstSystemOperator(value);
          let operatorValue = value[operator];
          let operation = operators[operator](...operatorValue);
          Object.assign(acc, operation);
        } else {
          for (let key in value) {
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

export function find(this: DB, collectionName: string) {
  const self = this;

  return async function findMethod(
    searchQuery: DBFrameworkCollectionSearchParams,
    paginateOptions: FaunaPaginateOptions = {},
    mapper: FaunaPaginateMapper = q.Lambda('x', q.Get(q.Var('x'))),
  ) {
    return execute(
      [
        {
          name: `Find (${qs.stringify(searchQuery).slice(0, 20)}...) in (${collectionName})`,
          task() {
            let paginate = q.Paginate(parseSearchQuery(collectionName, searchQuery), paginateOptions);
            return self.query(mapper ? q.Map(paginate, mapper) : paginate);
          },
        },
      ],
      {
        domain: 'DB.collection.find',
      },
    );
  };
}
