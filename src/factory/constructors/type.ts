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
              field: q.Select('field', q.Var('state'), '*unknown*'),
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
        value,
        options,
        state,
        valueIsSimple: q.Or(q.IsString(q.Var('value')), q.IsObject(q.Var('value'))),
        valueIsArray: q.IsArray(q.Var('value')),
      },
      // Reduce the values (if array or string or object?)
      q.Reduce(
        q.Lambda(
          ['reduced', 'mappedValue'],
          // Reduce all the expressions against each value
          q.Let(
            {
              result: q.Reduce(
                q.Lambda(
                  ['subReduced', 'expression'],
                  q.Let(
                    [
                      {
                        input: {
                          value: q.Var('mappedValue'),
                          options: q.Select('options', q.Var('subOutput'), {}),
                          state: q.Merge({ stop: false }, q.Select('state', q.Var('subOutput'), {})),
                          valid: q.Select('valid', q.Var('subOutput'), false),
                          sanitized: q.Select('sanitized', q.Var('subOutput'), false),
                          errors: q.Select('errors', q.Var('subOutput'), []),
                        },
                      },
                      {
                        result: q.If(
                          q.Not(q.Select(['state', 'stop'], q.Var('input'), false)),
                          q.Let(
                            {
                              inputValue: q.Select('value', q.Var('input'), {}),
                              inputOptions: q.Select('options', q.Var('input'), {}),
                              inputState: q.Select('state', q.Var('input'), {}),
                            },
                            q.Var('expression'),
                          ),
                          { stop: true },
                        ),
                      },
                      {
                        process: q.If(
                          q.Not(q.Select(['state', 'stop'], 'input', false)),
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
                        output: q.If(
                          q.Not(q.Select(['state', 'stop'], q.Var('input'), false)),
                          {
                            value: q.Select('value', q.Var('process'), null),
                            valid: q.And(q.Select('valid', q.Var('process'), false), q.Select('valid', q.Var('input'), false)),
                            sanitized: q.Or(q.Select('sanitized', q.Var('process'), false), q.Select('sanitized', q.Var('input'), false)),
                            errors: q.Append(q.Select('errors', q.Var('process'), []), q.Select('errors', q.Var('input'), [])),
                            options: q.Select('options', q.Var('input'), {}),
                            state: q.Merge(q.Select('state', q.Var('input'), {}), {
                              stop: q.Select('stop', q.Var('process'), false),
                              output: q.If(
                                q.IsArray(q.Var('value')),
                                q.Append([q.Select('value', q.Var('process'), null)], q.Select('value', q.Var('input'), [])),
                                q.Select('value', q.Var('process'), null),
                              ),
                            }),
                          },
                          q.Var('input'),
                        ),
                      },
                    ],
                    {
                      // value: q.Select('value', q.Var('composition'), null),
                      // valid: q.Select('valid', q.Var('composition'), false),
                      // sanitized: q.Select('sanitized', q.Var('composition'), false),
                      // errors: q.Select('errors', q.Var('composition'), []),
                    },
                  ),
                ),
                {
                  // Initiate subOutput Here
                },
                fqlExpressions,
              ),
            },
            {
              // value: q.Select('value', q.Var('composition'), null),
              // valid: q.Select('valid', q.Var('composition'), false),
              // sanitized: q.Select('sanitized', q.Var('composition'), false),
              // errors: q.Select('errors', q.Var('composition'), []),
            },
          ),
        ),
        {
          // Initiate output Here
        },
        q.If(q.IsArray(q.Var('value')), q.Var('value'), [q.Select('value', q.Var('input'), null)]),
      ),
    );

    // return q.Let(
    //   q.Prepend(
    //     [
    //       {
    //         value,
    //       },
    //       {
    //         input: {
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
    //     value: q.Select('value', q.Var('input'), null),
    //     valid: q.Select('valid', q.Var('input'), false),
    //     sanitized: q.Select('sanitized', q.Var('input'), false),
    //     errors: q.Select('errors', q.Var('input'), []),
    //   },
    // );
  };
}
