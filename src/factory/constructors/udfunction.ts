// types
import { query as q, Expr } from 'faunadb';
import { FactoryContextDefinition } from 'types/factory/factory.context';
import { FaunaObject, FaunaUDFunctionOptions, WrapFunction } from '~/../types/fauna';
import { CONVENTION } from '~/consts';
import { ContextExtend } from './context';

export function BiotaFunctionName(name: string) {
  return `${CONVENTION.UDFUNCTION_PREFIX}${name.replace(CONVENTION.UDFUNCTION_PREFIX, '')}`;
}

export function Input(params: Expr, query: Expr) {
  return q.Let(params, query);
}
const removeOfflineCode = (obj: any) => {
  function reducer(item: any) {
    if (item instanceof Expr) {
      return new Expr(reducer((item as any).raw));
    } else if (Array.isArray(item)) {
      return item.map(reducer);
    } else if (item && typeof item === 'object') {
      try {
        const safeItem = JSON.parse(JSON.stringify(item));
        if (safeItem.if && safeItem.if.select) {
          const select = Array.isArray(safeItem.if.select) ? safeItem.if.select : [safeItem.if.select];
          if (select.includes('offline')) {
            return reducer(reducer((item.else as any).raw));
          }
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

  return reducer(obj);
};

export function UDFunctionFromMethod(methodRaw: any) {
  const getRaw = (obj: any) => {
    if (typeof obj === 'object' && obj) {
      try {
        if (obj.raw) {
          obj = obj.raw;
        }
      } catch (error) {}
      return obj;
    }
  };

  // const safe = (obj: any) => JSON.parse(JSON.stringify(obj));
  // methodRaw = safe(methodRaw);
  let definition: FaunaUDFunctionOptions = {};
  let args = [];
  if (getRaw(methodRaw).if && getRaw(methodRaw).then && getRaw(methodRaw).else) {
    try {
      definition = getRaw(getRaw(getRaw(methodRaw).else).let[0].UDFunctionDefinition).object as FaunaUDFunctionOptions;
    } catch (error) {
      // nothing
    }
    try {
      args = getRaw(getRaw(getRaw(methodRaw).else).let[1].Args) || [];
    } catch (error) {
      // nothing
    }
    try {
      const query = getRaw(getRaw(methodRaw).then).in;
      definition.body = q.Query(
        q.Lambda(
          ['ctx', 'params'],
          q.Let(
            args.reduce((letObj, key) => {
              letObj[key] = q.Select(key, q.Var('params'), null);
              return letObj;
            }, {}),
            removeOfflineCode(query),
          ),
        ),
      );
    } catch (error) {
      // nothing
    }
  }
  if (definition.name) {
    return definition;
  } else {
    return null;
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
    q.Call(
      definition.name,
      ContextExtend(context, 'udf.CallFunction >' + definition.name),
      params,
    ),
    // q.Call(
    //   BiotaFunctionName('CallFunction'),
    //   ContextExtend(context, 'udf.CallFunction >' + definition.name),
    //   q.Select('name', q.Var('UDFunctionDefinition'), null),
    //   params,
    // ),
  );
}

export function UDFunction(fn: FaunaUDFunctionOptions): FaunaUDFunctionOptions {
  let { name = '', body, data, role } = fn || {};
  let self = {
    name,
    body,
    data,
    role,
  };

  return self;
}
