import { Expr, query as q } from 'faunadb';
import { FALSE_EXPR, TYPE_ERRORS_MESSAGES } from '~/consts';
import { IsFalse } from '../api/ql/IsFalse';
import { ResultData } from './result';
import { ArrayIndexed } from '../api/ql/ArrayIndexes';

export function TypeErrors(state: Expr, errors: Expr[]) {
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
                      q.And(q.Not(IsFalse(q.Var('expected'))), q.IsString(q.Var('expected'))),
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

export function TypeArrayResolver(value: Expr, itemsOptions: Expr, state: Expr) {
  return (...queries: ((...args: any[]) => Expr)[]) => {
    // return TypeResolver(q.Select(0, q.Var('value')), itemsOptions, state)(...queries)
    return q.Reduce(
      q.Lambda(['reduced', 'step'], {
        // process: q.Abort(q.Format('%@', { step: q.Var('step') })),
        //
        value: q.Append([q.Select('value', q.Var('step'), null)], q.Select('value', q.Var('reduced'), [])),
        valid: q.And(q.Select('valid', q.Var('step'), false), q.Select('valid', q.Var('reduced'), false)),
        sanitized: q.Or(q.Select('sanitized', q.Var('step'), false), q.Select('sanitized', q.Var('reduced'), false)),
        errors: q.Append(q.Select('errors', q.Var('step'), []), q.Select('errors', q.Var('reduced'), [])),
        //
        results: q.Append([q.Var('step')], q.Select('results', q.Var('reduced'), [])),
      }),
      {
        value: [],
        valid: true,
        sanitized: false,
        errors: [],
      },
      q.Map(
        ArrayIndexed(value),
        q.Lambda(
          ['index', 'item'],
          TypeResolver(
            q.Var('item'),
            itemsOptions,
            q.Merge(state, { field: q.Concat([q.Select('field', state, '$root'), q.ToString(q.Var('index'))], '.') }),
          )(...queries),
          // q.Abort(q.Format('%@', { step: TypeResolver(q.Var('item'), options, state)(...queries) }))
          // q.Let(
          //   {
          //     // ab: q.Abort(q.Format('%@', { item: q.Var('item') })),
          //     step: q.Abort(q.Format('%@', { step: TypeResolver(q.Var('item'), options, state)(...queries) })),
          //   },
          //   q.Abort(q.Format('%@', { step: q.Var('step') })),
          // ),
        ),
      ),

      // q.Abort(q.Format('%@', { steps: q.Map(value, q.Lambda('item', TypeResolver(q.Var('item'), options, state)(...queries))) })),
    );
  };
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
      },
    );
  };
}
