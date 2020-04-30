import { query as q } from 'faunadb';
import { PATTERNS, FALSE_EXPR } from '~/consts';
import { MethodDispatch, MethodQuery } from '~/factory/constructors/method';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryTypeApi } from '~/types/factory/factory.type';
import { TypeResolve, TypeErrors } from '../constructors/type';
import { BiotaFunctionName } from './constructors';
import { ArrayContains } from './ql/ArrayContains';
import { CanConvertToString } from './ql/CanConvertToString';
import { Switch } from './ql/Switch';
import { ResultData } from '../constructors/result';

// tslint:disable-next-line: only-arrow-functions
export const type: FactoryContext<FactoryTypeApi> = function (context): FactoryTypeApi {
  // tslint:disable-next-line: only-arrow-functions
  return {
    validate(instance, schema, state) {
      const inputs = { instance, schema, state };
      // ↓↓↓↓
      const query = MethodQuery(
        {
          type: q.Select('type', q.Var('schema'), null),
          newState: q.Merge(q.Var('state'), { field: q.If(q.IsNull(q.Select('field', q.Var('state'), null)), 'root', q.Var('field')) }),
          result: Switch(
            q.Var('type'),
            {
              any: ResultData(type(q.Var('ctx')).any.validate(q.Var('instance'), q.Var('schema'), q.Var('newState'))),
              string: ResultData(type(q.Var('ctx')).string.validate(q.Var('instance'), q.Var('schema'), q.Var('newState'))),
              array: ResultData(type(q.Var('ctx')).array.validate(q.Var('instance'), q.Var('schema'), q.Var('newState'))),
            },
            {
              value: q.Var('value'),
              valid: true,
              sanitized: false,
              errors: [],
            },
          ),
        },
        q.Var('result'),
      );
      // ↓↓↓↓
      const offline = 'factory.type.validate';
      const online = {
        name: BiotaFunctionName('TypeValidate'),
      };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    any: {
      validate(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery({}, TypeResolve(q.Var('value'), q.Var('options'), q.Var('state'))(type(q.Var('ctx')).any.type));
        // ↓↓↓↓
        const offline = 'factory.type.any.validate';
        const online = {
          name: BiotaFunctionName('TypeAnyValidate'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      type(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            isAny: true,
          },
          {
            value: q.Var('value'),
            valid: q.Var('isAny'),
            sanitized: false,
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.any.type';
        const online = {
          name: BiotaFunctionName('TypeAnyType'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    },
    string: {
      validate(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {},
          TypeResolve(
            q.Var('value'),
            q.Var('options'),
            q.Var('state'),
          )(
            // type(q.Var('ctx')).string.convert,
            type(q.Var('ctx')).string.type,
            // type(q.Var('ctx')).string.trim,
            // type(q.Var('ctx')).string.trimStart,
            // type(q.Var('ctx')).string.trimEnd,
            // type(q.Var('ctx')).string.padStart,
            // type(q.Var('ctx')).string.padEnd,
            // type(q.Var('ctx')).string.lowercase,
            // type(q.Var('ctx')).string.uppercase,
            // type(q.Var('ctx')).string.empty,
            // type(q.Var('ctx')).string.min,
            // type(q.Var('ctx')).string.max,
            // type(q.Var('ctx')).string.length,
            // type(q.Var('ctx')).string.pattern,
            // type(q.Var('ctx')).string.contains,
            // type(q.Var('ctx')).string.enum,
            // type(q.Var('ctx')).string.numeric,
            // type(q.Var('ctx')).string.alpha,
            // type(q.Var('ctx')).string.alphanum,
            // type(q.Var('ctx')).string.alphadash,
          ),
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.validate';
        const online = {
          name: BiotaFunctionName('TypeStringValidate'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      type(value = null, options = {}, state = {}) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            abort: q.Abort(q.Format('%@', { value, options, state })),
            isString: q.IsString(q.Var('value')),
          },
          {
            value: q.Var('value'),
            valid: q.Var('isString'),
            stop: q.Not(q.Var('isString')),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('isString')),
                type: 'string',
                actual: q.Var('value'),
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.type';
        const online = {
          name: BiotaFunctionName('TypeStringType'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      convert(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasConvert: q.Select('convert', q.Var('options'), false),
            // ↓
            canConvertToString: CanConvertToString(q.Var('value')),
            // ↓
            updatedValue: q.If(q.And(q.Var('hasConvert'), q.Var('canConvertToString')), q.ToString(q.Var('value')), q.Var('value')),
            valid: q.If(q.Var('hasConvert'), q.Var('canConvertToString'), true),
          },
          {
            value: q.Var('updatedValue'),
            valid: q.Var('valid'),
            sanitized: q.Var('hasConvert'),
            stop: q.Not(q.Var('valid')),
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringConvert',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.pattern';
        const online = {
          name: BiotaFunctionName('TypeStringPattern'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      trim(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasTrim: q.Select('trim', q.Var('options'), false),
            // ↓
            updatedValue: q.If(q.Var('hasTrim'), q.Trim(q.Var('value')), q.Var('value')),
          },
          {
            value: q.Var('updatedValue'),
            valid: true,
            sanitized: q.Var('hasTrim'),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.trim';
        const online = {
          name: BiotaFunctionName('TypeStringTrim'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      trimStart(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasTrimStart: q.Select('trimStart', q.Var('options'), false),
            // ↓
            updatedValue: q.If(
              q.Var('hasTrimStart'),
              q.ReplaceStrRegex(q.Var('value'), PATTERNS.TRIM_LEFT.toString().slice(1, -1), ''),
              q.Var('value'),
            ),
          },
          {
            value: q.Var('updatedValue'),
            valid: true,
            sanitized: q.Var('hasTrimStart'),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.trimStart';
        const online = {
          name: BiotaFunctionName('TypeStringTrimStart'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      trimEnd(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasTrimEnd: q.Select('trimEnd', q.Var('options'), false),
            // ↓
            updatedValue: q.If(
              q.Var('hasTrimEnd'),
              q.ReplaceStrRegex(q.Var('value'), PATTERNS.TRIM_RIGHT.toString().slice(1, -1), ''),
              q.Var('value'),
            ),
          },
          {
            value: q.Var('updatedValue'),
            valid: true,
            sanitized: q.Var('hasTrimEnd'),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.trimEnd';
        const online = {
          name: BiotaFunctionName('TypeStringTrimEnd'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      padStart(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            padStart: q.Select('padStart', q.Var('options'), null),
            padChar: q.Select('padChar', q.Var('options'), ' '),
            hasPadStart: q.IsNumber(q.Var('padStart')),
            // ↓
            updatedValue: q.If(
              q.Var('hasPadStart'),
              q.Concat([q.Repeat(q.Var('padChar'), q.Var('padStart')), q.Var('value')], ''),
              q.Var('value'),
            ),
          },
          {
            value: q.Var('updatedValue'),
            valid: true,
            sanitized: q.Var('hasPadStart'),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.padStart';
        const online = {
          name: BiotaFunctionName('TypeStringPadStart'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      padEnd(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            padEnd: q.Select('padEnd', q.Var('options'), null),
            padChar: q.Select('padChar', q.Var('options'), ' '),
            hasPadEnd: q.IsNumber(q.Var('padEnd')),
            // ↓
            updatedValue: q.If(
              q.Var('hasPadEnd'),
              q.Concat([q.Repeat(q.Var('padChar'), q.Var('padEnd')), q.Var('value')], ''),
              q.Var('value'),
            ),
          },
          {
            value: q.Var('updatedValue'),
            valid: true,
            sanitized: q.Var('hasPadEnd'),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.padEnd';
        const online = {
          name: BiotaFunctionName('TypeStringPadEnd'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      lowercase(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasLowercase: q.Select('lowercase', q.Var('options'), false),
            // ↓
            updatedValue: q.If(q.Var('hasLowercase'), q.LowerCase(q.Var('value')), q.Var('value')),
          },
          {
            value: q.Var('updatedValue'),
            valid: true,
            sanitized: q.Var('hasLowercase'),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.lowercase';
        const online = {
          name: BiotaFunctionName('TypeStringLowercase'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      uppercase(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasUppercase: q.Select('uppercase', q.Var('options'), false),
            // ↓
            updatedValue: q.If(q.Var('hasUppercase'), q.UpperCase(q.Var('value')), q.Var('value')),
          },
          {
            value: q.Var('updatedValue'),
            valid: true,
            sanitized: q.Var('hasUppercase'),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.uppercase';
        const online = {
          name: BiotaFunctionName('TypeStringUppercase'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      empty(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasEmpty: q.Contains('empty', q.Var('options')),
            empty: q.Select('empty', q.Var('options'), false),
            // ↓
            valid: q.If(
              q.Var('hasEmpty'),
              q.If(q.Var('empty'), q.Equals(q.Length(q.Var('value')), 0), q.GT(q.Length(q.Var('value')), 0)),
              true,
            ),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: q.If(q.Var('empty'), 'stringEmpty', 'stringNonEmpty'),
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.empty';
        const online = {
          name: BiotaFunctionName('TypeStringEmpty'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      min(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            min: q.Select('min', q.Var('options'), null),
            hasMin: q.IsNumber(q.Var('min')),
            // ↓
            valid: q.If(q.Var('hasMin'), q.GTE(q.Length(q.Var('value')), q.Var('min')), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringMin',
                expected: q.Var('min'),
                actual: q.Length(q.Var('value')),
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.min';
        const online = {
          name: BiotaFunctionName('TypeStringMin'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      max(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            max: q.Select('max', q.Var('options'), null),
            hasMax: q.IsNumber(q.Var('max')),
            // ↓
            valid: q.If(q.Var('hasMax'), q.GTE(q.Length(q.Var('value')), q.Var('max')), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringMax',
                expected: q.Var('max'),
                actual: q.Length(q.Var('value')),
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.max';
        const online = {
          name: BiotaFunctionName('TypeStringMax'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      length(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            minLength: q.Select('minLength', q.Var('options'), null),
            maxLength: q.Select('maxLength', q.Var('options'), null),
            // ↓
            isMinLength: q.If(q.IsNumber(q.Var('minLength')), q.GTE(q.Length(q.Var('value')), q.Var('minLength')), true),
            isMaxLength: q.If(q.IsNumber(q.Var('maxLength')), q.LTE(q.Length(q.Var('value')), q.Var('maxLength')), true),
            // ↓
            valid: q.And(q.Var('isMinLength'), q.Var('isMaxLength')),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('isMinLength')),
                type: 'stringMin',
                expected: q.Var('minLength'),
                actual: q.Length(q.Var('value')),
              },
              {
                wrong: q.Not(q.Var('isMaxLength')),
                type: 'stringMax',
                expected: q.Var('maxLength'),
                actual: q.Length(q.Var('value')),
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.length';
        const online = {
          name: BiotaFunctionName('TypeStringLength'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      pattern(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            pattern: q.Select('pattern', q.Var('options'), null),
            // ↓
            hasPattern: q.IsString(q.Var('pattern')),
            // ↓
            valid: q.If(q.Var('hasPattern'), q.GT(q.Count(q.FindStrRegex(q.Var('value'), q.Var('pattern'))), 0), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringPattern',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.pattern';
        const online = {
          name: BiotaFunctionName('TypeStringPattern'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      contains(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            contains: q.Select('contains', q.Var('options'), null),
            hasContains: q.IsString(q.Var('contains')),
            // ↓
            valid: q.If(q.Var('hasContains'), q.GT(q.Count(q.FindStr(q.Var('value'), q.Var('contains'))), 0), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringContains',
                expected: q.Var('contains'),
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.contains';
        const online = {
          name: BiotaFunctionName('TypeStringContains'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      enum(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            enum: q.Select('enum', q.Var('options'), null),
            enumIsStringArray: q.If(
              q.IsArray(q.Var('enum')),
              q.All(q.Map(q.Var('enum'), q.Lambda('item', q.IsString(q.Var('item'))))),
              false,
            ),
            hasEnum: q.Var('enumIsStringArray'),
            // ↓
            valid: q.If(q.Var('hasEnum'), ArrayContains(q.Var('enum'), q.Var('value')), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringEnum',
                expected: q.Var('enum'),
                actual: q.Var('value'),
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.enum';
        const online = {
          name: BiotaFunctionName('TypeStringEnum'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      numeric(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasNumeric: q.Contains('numeric', q.Var('options')),
            numeric: q.Select('numeric', q.Var('options'), false),
            // ↓
            valid: q.If(
              q.Var('hasNumeric'),
              q.Let(
                {
                  matches: q.Length(q.ToString(q.ToNumber(q.Var('value')))),
                },
                q.If(q.Var('numeric'), q.GT(q.Var('matches'), 0), q.Equals(q.Var('matches'), 0)),
              ),
              true,
            ),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringNumeric',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.numeric';
        const online = {
          name: BiotaFunctionName('TypeStringNumeric'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      alpha(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasAlpha: q.Contains('alpha', q.Var('options')),
            alpha: q.Select('alpha', q.Var('options'), false),
            // ↓
            valid: q.If(
              q.Var('hasAlpha'),
              q.Let(
                {
                  matches: q.Count(q.FindStrRegex(q.Var('value'), PATTERNS.ALPHA.toString().slice(1, -1))),
                },
                q.If(q.Var('alpha'), q.GT(q.Var('matches'), 0), q.Equals(q.Var('matches'), 0)),
              ),
              true,
            ),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringAlpha',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.alpha';
        const online = {
          name: BiotaFunctionName('TypeStringAlpha'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      alphanum(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasAlphanum: q.Contains('alphanum', q.Var('options')),
            alphanum: q.Select('alphanum', q.Var('options'), false),
            // ↓
            valid: q.If(
              q.Var('hasAlphanum'),
              q.Let(
                {
                  matches: q.Count(q.FindStrRegex(q.Var('value'), PATTERNS.ALPHANUM.toString().slice(1, -1))),
                },
                q.If(q.Var('alphanum'), q.GT(q.Var('matches'), 0), q.Equals(q.Var('matches'), 0)),
              ),
              true,
            ),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringAlphanum',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.alphanum';
        const online = {
          name: BiotaFunctionName('TypeStringAlphanum'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      alphadash(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasAlphadash: q.Contains('alphadash', q.Var('options')),
            alphadash: q.Select('alphadash', q.Var('options'), false),
            // ↓
            valid: q.If(
              q.Var('hasAlphadash'),
              q.Let(
                {
                  matches: q.Count(q.FindStrRegex(q.Var('value'), PATTERNS.ALPHADASH.toString().slice(1, -1))),
                },
                q.If(q.Var('alphadash'), q.GT(q.Var('matches'), 0), q.Equals(q.Var('matches'), 0)),
              ),
              true,
            ),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringAlphadash',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.string.alphadash';
        const online = {
          name: BiotaFunctionName('TypeStringAlphadash'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    },
    array: {
      validate(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery({}, TypeResolve(q.Var('value'), q.Var('options'), q.Var('state'))(type(q.Var('ctx')).array.type));
        // ↓↓↓↓
        const offline = 'factory.type.array.validate';
        const online = {
          name: BiotaFunctionName('TypeArrayValidate'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      type(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            isArray: q.IsArray(q.Var('value')),
          },
          {
            value: q.Var('value'),
            valid: q.Var('isArray'),
            sanitized: false,
            stop: q.Not(q.Var('isArray')),
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('isArray')),
                type: 'array',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.array.type';
        const online = {
          name: BiotaFunctionName('TypeArrayType'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      noItems(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasNoItems: q.Contains('noItems', q.Var('options')),
            noItems: q.Select('noItems', q.Var('options'), false),
            // ↓
            valid: q.If(q.Var('hasNoItems'), q.If(q.Var('noItems'), q.IsEmpty(q.Var('value')), q.IsNonEmpty(q.Var('value'))), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: q.If(q.Var('noItems'), 'arrayNoItems', 'arrayNonNoItems'),
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.array.noItems';
        const online = {
          name: BiotaFunctionName('TypeArrayNoItems'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      minItems(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasMinItems: q.Contains('minItems', q.Var('options')),
            minItems: q.Select('minItems', q.Var('options'), null),
            isValidMinItems: q.IsNumber(q.Var('minItems')),
            // ↓
            valid: q.If(q.And(q.Var('hasMinItems'), q.Var('isValidMinItems')), q.GTE(q.Count(q.Var('value')), q.Var('minItems')), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'arrayMinItems',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.array.minItems';
        const online = {
          name: BiotaFunctionName('TypeArrayMinItems'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      maxItems(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasMaxItems: q.Contains('maxItems', q.Var('options')),
            maxItems: q.Select('maxItems', q.Var('options'), null),
            isValidMaxItems: q.IsNumber(q.Var('maxItems')),
            // ↓
            valid: q.If(q.And(q.Var('hasMaxItems'), q.Var('isValidMaxItems')), q.LTE(q.Count(q.Var('value')), q.Var('maxItems')), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'arrayMaxItems',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.array.maxItems';
        const online = {
          name: BiotaFunctionName('TypeArrayMaxItems'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      nbItems(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasNbItems: q.Contains('nbItems', q.Var('options')),
            nbItems: q.Select('nbItems', q.Var('options'), null),
            isValidNbItems: q.IsNumber(q.Var('nbItems')),
            // ↓
            valid: q.If(q.And(q.Var('hasNbItems'), q.Var('isValidNbItems')), q.Equals(q.Count(q.Var('value')), q.Var('nbItems')), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'arrayNbItems',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.array.nbItems';
        const online = {
          name: BiotaFunctionName('TypeArrayNbItems'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      matchItems(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasMatchItems: q.Contains('matchItems', q.Var('options')),
            matchItems: q.Select('matchItems', q.Var('options'), FALSE_EXPR),
            isValidMatchItems: q.Not(q.Equals(q.Var('matchItems'), FALSE_EXPR)),
            // ↓
            valid: q.If(
              q.And(q.Var('hasMatchItems'), q.Var('isValidMatchItems')),
              q.IsEmpty(q.Difference(q.Distinct(q.Var('matchItems')), q.Var('value'))),
              true,
            ),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'arrayMatchItems',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.array.matchItems';
        const online = {
          name: BiotaFunctionName('TypeArrayMatchItems'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      uniqueItems(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasUniqueItems: q.Contains('uniqueItems', q.Var('options')),
            uniqueItems: q.Select('uniqueItems', q.Var('options'), FALSE_EXPR),
            isValidUniqueItems: q.Not(q.Equals(q.Var('uniqueItems'), FALSE_EXPR)),
            // ↓
            valid: q.If(
              q.And(q.Var('hasUniqueItems'), q.Var('isValidUniqueItems')),
              q.Equals(q.Count(q.Distinct(q.Var('value'))), q.Count(q.Var('value'))),
              true,
            ),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'arrayUniqueItems',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.array.uniqueItems';
        const online = {
          name: BiotaFunctionName('TypeArrayUniqueItems'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      enumItems(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasEnumItems: q.Contains('enumItems', q.Var('options')),
            enumItems: q.Select('enumItems', q.Var('options'), []),
            isValidEnumItems: q.IsNonEmpty(q.IsArray(q.Var('enumItems'))),
            // ↓
            valid: q.If(
              q.And(q.Var('hasEnumItems'), q.Var('isValidEnumItems')),
              q.IsEmpty(q.Difference(q.Distinct(q.Var('enumItems')), q.Var('value'))),
              true,
            ),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'arrayEnumItems',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.array.enumItems';
        const online = {
          name: BiotaFunctionName('TypeArrayEnumItems'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      items(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasItems: q.Contains('items', q.Var('options')),
            items: q.Select('items', q.Var('options'), null),
            isValidItems: q.IsObject(q.Var('items')),
            // ↓
            valid: q.If(
              q.And(q.Var('hasItems'), q.Var('isValidItems')),
              TypeResolve(q.Var('value'), q.Var('items'), q.Var('state'))(type(q.Var('ctx')).validate),
              true,
            ),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: TypeErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'arrayItems',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.type.array.items';
        const online = {
          name: BiotaFunctionName('TypeArrayItems'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    },
  };
};
