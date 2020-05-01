import { Expr, query as q } from 'faunadb';
import { FALSE_EXPR, TYPE_ERRORS_MESSAGES } from '~/consts';
import { IsFalse } from '../api/ql/IsFalse';
import { ResultData } from './result';
import * as fs from 'fs';
import { RunExpr } from './query';

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
export function TypeResolver(mapType: string, value: Expr, options: Expr, state: Expr) {
  return (...expressions: any[]) => {
    const fqlExpressions = expressions.map((expression) => {
      return typeof expression === 'function'
        ? q.Lambda(
            ['inputValue', 'inputOptions', 'inputState'],
            ResultData(expression(q.Var('inputValue'), q.Var('inputOptions'), q.Var('inputState'))),
          )
        : expression;
    });

    // fs.writeFileSync('./fqlExpressions.json', JSON.stringify(fqlExpressions, null, 2));

    const response = q.Let(
      {
        value,
        options,
        state,
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
                          options: q.Select('options', q.Var('subReduced'), {}),
                          state: q.Merge({ stop: false }, q.Select('state', q.Var('subReduced'), {})),
                          valid: q.Select('valid', q.Var('subReduced'), false),
                          sanitized: q.Select('sanitized', q.Var('subReduced'), false),
                          errors: q.Select('errors', q.Var('subReduced'), []),
                        },
                      },
                      {
                        result: q.If(
                          q.Not(q.Select(['state', 'stop'], q.Var('input'), false)),
                          q.Let(
                            {
                              // inputValue: q.Select('value', q.Var('input'), {}),
                              // inputOptions: q.Select('options', q.Var('input'), {}),
                              // inputState: q.Select('state', q.Var('input'), {}),
                            },
                            // RunExpr(q.Var('expression'), [q.Var('inputValue'), q.Var('inputOptions'), q.Var('inputState')]),
                            RunExpr(q.Var('expression'), ['1', {}, {}]),
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
                            }),
                          },
                          q.Var('input'),
                        ),
                      },
                    ],
                    {
                      value: q.Select(['state', 'output'], q.Var('output'), null),
                      valid: q.Select('valid', q.Var('output'), false),
                      sanitized: q.Select('sanitized', q.Var('output'), false),
                      errors: q.Select('errors', q.Var('output'), []),
                    },
                  ),
                ),
                {
                  composition: {
                    value: q.Select('value', q.Var('reduced'), null),
                    options: q.Select('options', q.Var('reduced'), {}),
                    state: q.Select('state', q.Var('reduced'), {}),
                    valid: q.Select('valid', q.Var('reduced'), true),
                    sanitized: q.Select('sanitized', q.Var('reduced'), false),
                    errors: q.Select('errors', q.Var('reduced'), []),
                  },
                },
                fqlExpressions,
              ),
            },
            {
              value:
                mapType === 'array'
                  ? q.Append([q.Select('value', q.Var('output'), null)], q.Select('value', q.Var('result'), []))
                  : q.Select('value', q.Var('result'), null),
              valid: q.Select('valid', q.Var('result'), false),
              sanitized: q.Select('sanitized', q.Var('result'), false),
              errors: q.Select('errors', q.Var('result'), []),
            },
          ),
        ),
        {
          value: q.Var('value'),
          options: q.Var('options'),
          state: q.Merge({ stop: false }, q.Var('state')),
          valid: true,
          sanitized: false,
          errors: [],
        },
        mapType === 'array' ? q.Var('value') : [q.Var('value')],
      ),
    );

    // fs.writeFileSync('./TypeResolver.json', JSON.stringify(response, null, 2));

    return response;
  };
}
