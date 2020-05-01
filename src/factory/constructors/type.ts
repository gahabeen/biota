import { Expr, query as q } from 'faunadb';
import { FALSE_EXPR, Types, TYPE_ERRORS_MESSAGES } from '~/consts';
import { FaunaObject, FaunaString } from '~/types/fauna';
import { StringSplit } from '../api/ql';
import { ArrayContains } from '../api/ql/ArrayContains';
import { ConvertToNumber } from '../api/ql/ConvertToNumber';
import { IsFalse } from '../api/ql/IsFalse';
import { Slice } from '../api/ql/Slice';
import { ResultData } from './result';

export function TypeDefinition(definition: FaunaString | FaunaObject) {
  return q.Let(
    {
      definition,
    },
    q.If(
      q.IsObject(q.Var('definition')),
      q.Var('definition'),
      q.If(
        q.And(q.IsString(q.Var('definition')), q.GT(q.Length(q.Var('definition')), 0)),
        q.Let(
          {
            splitted: StringSplit(q.Var('definition'), '|'),
            firstItem: StringSplit(q.Select(0, q.Var('splitted'), ''), ','),
            firstItemIsType: q.Any(
              q.Map(q.Var('firstItem'), q.Lambda('firstItemPart', ArrayContains(Object.keys(Types), q.Var('firstItemPart')))),
            ),
            type: q.If(q.Var('firstItemIsType'), q.Var('firstItem'), null),
            keyValues: q.Map(
              q.If(q.IsNull(q.Var('type')), q.Var('splitted'), Slice(q.Var('splitted'), 1)),
              q.Lambda(
                'item',
                // q.Abort(q.Format('%@', { item: StringSplit(q.Var('item'), ':') })),
                q.Let(
                  { keyValue: StringSplit(q.Var('item'), ':') },
                  q.If(
                    q.LT(q.Count(q.Var('keyValue')), 2),
                    [q.Select(0, q.Var('keyValue')), true],
                    [
                      q.Select(0, q.Var('keyValue')),
                      q.Let(
                        {
                          value: q.Select(1, q.Var('keyValue')),
                          numberCast: ConvertToNumber(q.Var('value')),
                        },
                        q.If(q.Not(q.IsNull(q.Var('numberCast'))), q.Var('numberCast'), q.Var('value')),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            // ab: q.Abort(q.Format('%@', { keyValues: q.Var('keyValues') })),
            // ab: q.Abort(q.Format('%@', { keyValues: q.If(q.IsNull(q.Var('type')), q.Var('splitted'), Slice(q.Var('splitted'), 1)) })),
          },
          q.Reduce(
            q.Lambda(['objectDefinition', 'keyValue'], q.Merge(q.Var('objectDefinition'), q.ToObject([q.Var('keyValue')]))),
            { type: q.Var('type') },
            q.Var('keyValues'),
          ),
        ),
        q.If(q.IsBoolean(q.Var('definition')), q.If(q.Var('definition'), {}, false), q.Var('definition')),
      ),
    ),
  );
}

export function TypeErrors(state: Expr, errors: Expr) {
  return q.Let(
    {
      templates: TYPE_ERRORS_MESSAGES,
      state,
    },
    q.Reduce(
      q.Lambda(
        ['errors', 'error'],
        q.If(
          q.Select('wrong', q.Var('error'), false),
          q.Let(
            {
              type: q.Select('type', q.Var('error'), ''),
              expected: q.Select('expected', q.Var('error'), FALSE_EXPR),
              expectedString: q.If(
                q.Not(IsFalse(q.Var('expected'))),
                q.If(q.IsArray(q.Var('expected')), q.Concat(q.Var('expected'), ','), q.Var('expected')),
                q.Var('expected'),
              ),
              actual: q.Select('actual', q.Var('error'), FALSE_EXPR),
              field: q.Select('field', q.Var('state'), '_unknown_'),
              filledMessage: q.Let(
                [
                  { msg: q.Select(q.Var('type'), q.Var('templates'), '') },
                  {
                    msg: q.If(q.IsString(q.Var('field')), q.ReplaceStr(q.Var('msg'), '{field}', q.Var('field')), q.Var('msg')),
                  },
                  {
                    msg: q.If(
                      q.And(q.Not(IsFalse(q.Var('expectedString'))), q.IsString(q.Var('expectedString'))),
                      q.ReplaceStr(q.Var('msg'), '{expected}', q.Var('expected')),
                      q.Var('msg'),
                    ),
                  },
                  {
                    msg: q.If(
                      q.And(q.Not(IsFalse(q.Var('actual'))), q.IsString(q.Var('actual'))),
                      q.ReplaceStr(q.Var('msg'), '{actual}', q.Var('actual')),
                      q.Var('msg'),
                    ),
                  },
                ],
                q.Var('msg'),
              ),
            },
            q.Append(
              [
                {
                  type: q.Var('type'),
                  expected: q.If(q.Not(IsFalse(q.Var('expected'))), q.Var('expected'), null),
                  actual: q.If(q.Not(IsFalse(q.Var('actual'))), q.Var('actual'), null),
                  field: q.If(q.Not(IsFalse(q.Var('field'))), q.Var('field'), null),
                  message: q.Var('filledMessage'),
                },
              ],
              q.Var('errors'),
            ),
          ),
          q.Var('errors'),
        ),
      ),
      [],
      errors,
    ),
  );
}

export function TypeArrayResolver(keyValues: Expr, itemsOptions: Expr, state: Expr) {
  return (...queries: ((...args: any[]) => Expr)[]) => {
    return q.Reduce(
      q.Lambda(['reduced', 'step'], {
        // process: q.Abort(q.Format('%@', { step: q.Var('step') })),
        value: q.Let(
          {
            key: q.Select(['state', 'key'], q.Var('step'), null),
          },
          q.If(
            q.And(q.IsNumber(q.Var('key')), q.IsArray(q.Select('value', q.Var('reduced'), []))),
            q.Append([q.Select('value', q.Var('step'), null)], q.Select('value', q.Var('reduced'), [])),
            q.If(
              q.And(q.IsString(q.Var('key')), q.IsObject(q.Select('value', q.Var('reduced'), {}))),
              q.Merge(q.Select('value', q.Var('reduced'), {}), q.ToObject([q.Var('key'), q.Select('value', q.Var('step'), null)])),
              q.Var('value'),
            ),
          ),
        ),
        valid: q.And(q.Select('valid', q.Var('step'), false), q.Select('valid', q.Var('reduced'), false)),
        sanitized: q.Or(q.Select('sanitized', q.Var('step'), false), q.Select('sanitized', q.Var('reduced'), false)),
        errors: q.Append(q.Select('errors', q.Var('step'), []), q.Select('errors', q.Var('reduced'), [])),
      }),
      {
        value: [],
        valid: true,
        sanitized: false,
        errors: [],
      },
      q.Map(
        keyValues,
        q.Lambda(
          ['key', 'item'],
          TypeResolver(
            q.Var('item'),
            q.Let(
              { state, itemsOptions },
              q.If(
                q.And(q.Select('generalDefinition', q.Var('state'), false), q.Equals('props', q.Select('methods', q.Var('state'), null))),
                q.Var('itemsOptions'),
                q.If(
                  q.Contains(q.Var('key'), q.Var('itemsOptions')),
                  q.Select(q.Var('key'), q.Var('itemsOptions')),
                  q.Var('itemsOptions'),
                  // q.Abort('TypeArrayResolver: No itemsOptions available for this key'),
                ),
              ),
            ),
            q.Merge(state, {
              key: q.Var('key'),
              field: q.Concat([q.Select('field', q.Var('state'), '$root'), q.ToString(q.Var('key'))], '.'),
            }),
          )(...queries),
        ),
      ),
    );
  };
}

export function TypeOr(results: Expr) {
  return q.Let(
    {
      results,
      validResult: q.Select(0, q.Filter(q.Var('results'), q.Lambda('result', q.Select('valid', q.Var('result'), false))), null),
      hasValidResult: q.Not(q.IsNull(q.Var('validResult'))),
    },
    q.If(
      q.Var('hasValidResult'),
      q.Var('validResult'),
      q.Reduce(
        q.Lambda(['reduced', 'result'], {
          value: null,
          valid: false,
          sanitized: q.Or(q.Select('sanitized', q.Var('result'), false), q.Select('sanitized', q.Var('reduced'), false)),
          errors: q.Append(q.Select('errors', q.Var('result'), []), q.Select('errors', q.Var('reduced'), [])),
        }),
        {
          value: null,
          valid: false,
          sanitized: false,
          errors: [],
        },
        q.Var('results'),
      ),
    ),
  );
}

export function TypeResolver(value: Expr, options: Expr, state: Expr) {
  return (...queries: ((...args: any[]) => Expr)[]) => {
    return q.Let(
      [
        {
          composition: {
            value,
            options,
            state: q.Merge({ stop: false }, state),
            valid: true,
            sanitized: false,
            errors: [],
          },
        },
        ...queries.reduce((list, query) => {
          list.push({
            // result: q.Abort(q.Format('%@', { composition: q.Var('composition') })),
            result: q.If(
              q.Not(q.Select(['state', 'stop'], q.Var('composition'), false)),
              ResultData(
                query(
                  q.Select('value', q.Var('composition'), null),
                  q.Select('options', q.Var('composition'), {}),
                  q.Select('state', q.Var('composition'), {}),
                ),
              ),
              { stop: true },
            ),
          });

          list.push({
            // process: q.Abort(q.Format('%@', { result: q.Var('result') })),
            process: q.If(
              q.Not(q.Select(['state', 'stop'], q.Var('composition'), false)),
              {
                value: q.Select('value', q.Var('result'), null),
                valid: q.Select('valid', q.Var('result'), true),
                sanitized: q.Select('sanitized', q.Var('result'), false),
                errors: q.Select('errors', q.Var('result'), []),
                stop: q.Select('stop', q.Var('result'), false),
              },
              { skip: true },
            ),
          });

          list.push({
            // composition: q.Abort(q.Format('%@', { process: q.Var('process') })),
            composition: q.If(
              q.Not(q.Select('skip', q.Var('process'), false)),
              {
                value: q.Select('value', q.Var('process'), null),
                valid: q.And(q.Select('valid', q.Var('process'), false), q.Select('valid', q.Var('composition'), false)),
                sanitized: q.Or(q.Select('sanitized', q.Var('process'), false), q.Select('sanitized', q.Var('composition'), false)),
                errors: q.Append(q.Select('errors', q.Var('process'), []), q.Select('errors', q.Var('composition'), [])),
                options: q.Select('options', q.Var('composition'), {}),
                state: q.Merge(q.Select('state', q.Var('composition'), {}), { stop: q.Select('stop', q.Var('process'), false) }),
              },
              q.Var('composition'),
            ),
          });

          // list.push({
          //   ab: q.Abort(q.Format('%@', { composition: q.Var('composition') })),
          // });

          return list;
        }, []),
      ],
      {
        // ab: q.Abort(q.Format('%@', { composition: q.Var('composition') })),
        value: q.Select('value', q.Var('composition'), null),
        valid: q.Select('valid', q.Var('composition'), false),
        sanitized: q.Select('sanitized', q.Var('composition'), false),
        errors: q.Select('errors', q.Var('composition'), []),
        state: q.Select('state', q.Var('composition'), {}),
      },
    );
  };
}
