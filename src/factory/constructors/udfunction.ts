// types
import { Expr, query as q } from 'faunadb';
import { CONVENTION } from '~/consts';
import { FactoryContextDefinition } from '~/types/factory/factory.context';
import { FaunaObject, FaunaUDFunctionOptions } from '~/types/fauna';
import { ContextExtend } from './context';

export function BiotaFunctionName(name: string) {
  return `${CONVENTION.UDFUNCTION_PREFIX}${name.replace(CONVENTION.UDFUNCTION_PREFIX, '')}`;
}

export function Input(params: Expr, query: Expr) {
  return q.Let(params, query);
}
const removeOfflineQuery = (obj: any) => {
  const functionsToCall = [];

  function reducer(item: any) {
    if (item instanceof Expr) {
      return new Expr(reducer((item as any).raw));
    } else if (Array.isArray(item)) {
      return item.map(reducer);
    } else if (item && typeof item === 'object') {
      try {
        const safeItem = JSON.parse(JSON.stringify(item));
        // if (safeItem.if && safeItem.if.select) {
        //   const select = Array.isArray(safeItem.if.select) ? safeItem.if.select : [safeItem.if.select];
        //   if (select.includes('offline')) {
        //     return reducer(reducer((item.else as any).raw));
        //   }
        // }
        if (safeItem.if && typeof safeItem?.then?.in?.call === 'string') {
          functionsToCall.push(safeItem?.then?.in?.call);
          return reducer(reducer((item.then as any).raw));
        }
      } catch (error) {
        // console.error(error);
      }

      return Object.entries(item).reduce((newObj, [key, value]) => {
        newObj[key] = reducer(value);
        return newObj;
      }, {});
    } else {
      return item;
    }
  }

  return { query: reducer(obj), functionsToCall };
};

export function UDFunctionFromMethod(methodRaw: any) {
  const getRaw = (obj: any) => {
    if (typeof obj === 'object' && obj) {
      try {
        if (obj.raw) {
          obj = obj.raw;
        }
        // tslint:disable-next-line: no-empty
      } catch (error) {}
      return obj;
    }
  };

  // const safe = (obj: any) => JSON.parse(JSON.stringify(obj));
  // methodRaw = safe(methodRaw);
  let definition: FaunaUDFunctionOptions = {};
  let args = [];
  const subsequentFunctionsToCall = [];
  if (getRaw(methodRaw).if && getRaw(methodRaw).then && getRaw(methodRaw).else) {
    try {
      definition = getRaw(getRaw(getRaw(methodRaw).then).let[0].UDFunctionDefinition).object as FaunaUDFunctionOptions;
    } catch (error) {
      // nothing
    }
    try {
      args = getRaw(getRaw(getRaw(methodRaw).then).let[1].Args) || [];
    } catch (error) {
      // nothing
    }
    try {
      const fullQuery = getRaw(getRaw(methodRaw).else).in;
      const { query, functionsToCall } = removeOfflineQuery(fullQuery);
      subsequentFunctionsToCall.push(...functionsToCall);
      definition.body = q.Query(
        q.Lambda(
          ['ctx', 'params'],
          q.Let(
            args.reduce((letObj, key) => {
              letObj[key] = q.Select(key, q.Var('params'), null);
              return letObj;
            }, {}),
            query,
          ),
        ),
      );
    } catch (error) {
      // nothing
    }
  }
  if (definition.name) {
    return { definition, subsequentFunctionsToCall };
  } else {
    return { definition: null, subsequentFunctionsToCall };
  }
}
export function CallFunction(
  nameOrDefinition: string | FaunaUDFunctionOptions,
  context: FactoryContextDefinition,
  params: FaunaObject,
  // query?: Expr,
) {
  const definition = typeof nameOrDefinition === 'object' ? nameOrDefinition : { name: nameOrDefinition };
  return q.Let(
    {
      UDFunctionDefinition: definition,
      Args: Object.keys(params || {}),
      // UDFunctionQuery: q.Let({}), //q.Format('%@', query),
    },
    q.Call(definition.name, ContextExtend(context, 'udf.CallFunction >' + definition.name, params), params),
    // q.Call(
    //   BiotaFunctionName('CallFunction'),
    //   ContextExtend(context, 'udf.CallFunction >' + definition.name),
    //   q.Select('name', q.Var('UDFunctionDefinition'), null),
    //   params,
    // ),
  );
}

export function UDFunction(fn: FaunaUDFunctionOptions): FaunaUDFunctionOptions {
  const { name = '', body, data, role } = fn || {};
  return {
    name,
    body,
    data,
    role,
  };
}
