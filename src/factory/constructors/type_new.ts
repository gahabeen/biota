import { Expr, query as q } from 'faunadb';
import { FALSE_EXPR, TYPE_ERRORS_MESSAGES } from '~/consts';
import { IsFalse } from '../api/ql/IsFalse';
import { ResultData } from './result';

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

// Resolve list of results
export function TypeResolve(value: Expr, options: Expr, state: Expr) {
  return (...expressions: any[]) => {
    const fqlExpressions = expressions.map((expression) =>
      typeof expression === 'function'
        ? // ? ResultData(expression(q.Var('inputValue'), q.Var('inputOptions'), q.Var('inputState')))
          ResultData(expression('1', {}, {}))
        : expression,
    );

    return q.Let(
      {
        valueIsArray: q.IsArray(q.Var('value')),
      },
      q.Reduce(
        q.Lambda(
          ['output', 'expression'],
          q.Append(
            q.Reduce(
              q.Lambda(
                ['subOutput', 'mapValue'],
                q.Append(
                  [
                    {
                      result: q.If(
                        q.Not(q.Select(['state', 'stop'], q.Var('composition'), false)),
                        q.Let(
                          {
                            inputValue: q.Var('mapValue'),
                            inputOptions: q.Select('options', q.Var('composition'), {}),
                            inputState: q.Select('state', q.Var('composition'), {}),
                          },
                          q.Var('expression'),
                        ),
                        { stop: true },
                      ),
                    },
                    {
                      process: q.If(
                        q.Not(q.Select(['state', 'stop'], 'composition', false)),
                        {
                          value: q.Select('value', q.Var('result'), null),
                          valid: q.Select('valid', q.Var('result'), true),
                          sanitized: q.Select('sanitized', q.Var('result'), false),
                          errors: q.Select('errors', q.Var('result'), []),
                          stop: q.Select('stop', q.Var('result'), false),
                        },
                        { stop: true },
                      ),
                    },
                    {
                      composition: q.If(
                        q.Not(q.Select(['state', 'stop'], q.Var('composition'), false)),
                        {
                          value: q.Select('value', q.Var('process'), null),
                          valid: q.And(q.Select('valid', q.Var('process'), false), q.Select('valid', q.Var('composition'), false)),
                          sanitized: q.Or(
                            q.Select('sanitized', q.Var('process'), false),
                            q.Select('sanitized', q.Var('composition'), false),
                          ),
                          errors: q.Append(q.Select('errors', q.Var('process'), []), q.Select('errors', q.Var('composition'), [])),
                          options: q.Select('options', q.Var('composition'), {}),
                          state: q.Merge(q.Select('state', q.Var('composition'), {}), {
                            stop: q.Select('stop', q.Var('process'), false),
                            output: q.If(
                              q.IsArray(q.Var('value')),
                              q.Append([q.Select('value', q.Var('process'), null)], q.Select('value', q.Var('composition'), [])),
                              q.Select('value', q.Var('process'), null),
                            ),
                          }),
                        },
                        q.Var('composition'),
                      ),
                    },
                  ],
                  q.Var('subList'),
                ),
              ),
              [],
              q.If(q.IsArray(q.Var('value')), q.Var('value'), [q.Select('value', q.Var('composition'), null)]),
            ),
            q.Var('list'),
          ),
        ),
        [],
        fqlExpressions,
      ),
    );

    // return q.Let(
    //   q.Prepend(
    //     [
    //       {
    //         value,
    //       },
    //       {
    //         composition: {
    //           value: q.If(q.IsArray(q.Var('value')), [], q.Var('value')),
    //           options,
    //           state: q.Merge({ stop: false }, state),
    //           valid: true,
    //           sanitized: false,
    //           errors: [],
    //         },
    //       },
    //     ],

    //   ),
    //   {
    //     value: q.Select('value', q.Var('composition'), null),
    //     valid: q.Select('valid', q.Var('composition'), false),
    //     sanitized: q.Select('sanitized', q.Var('composition'), false),
    //     errors: q.Select('errors', q.Var('composition'), []),
    //   },
    // );
  };
}
