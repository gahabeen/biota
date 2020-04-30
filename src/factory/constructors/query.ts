import { Expr, query as q } from 'faunadb';
import { parseJSON, toJSON } from '~/helpers/fauna/parse';

export function ParseQuery(input: Expr) {
  const parse = (expr: Expr) => parseJSON(JSON.stringify(expr));
  const convertBackToRaw = (query: Expr) => {
    if (typeof query !== 'undefined') {
      const queryParsed = parse(query);
      const queryObj = JSON.parse(JSON.stringify(queryParsed));
      if (query && typeof query === 'object') {
        if (queryObj?.['@query']?.lambda) {
          return new Expr(parse(queryObj['@query']));
        } else {
          return new Expr(parse(queryObj));
        }
      } else {
        return new Expr(parse(queryObj));
      }
    }
  };
  return convertBackToRaw(input);
}

export function RunExpr(expr: Expr, inputs: any[]) {
  return q.Select(0, q.Map([inputs], expr));
}
