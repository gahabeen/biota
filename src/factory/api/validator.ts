import { query as q } from 'faunadb';
import { MethodDispatch, MethodQuery } from '~/factory/constructors/method';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryValidatorApi } from '~/types/factory/factory.validator';
import { ValidatorCompose, ValidatorErrors } from '../constructors/validator';
import { BiotaFunctionName } from './constructors';
import { CanConvertToString } from './ql/CanConvertToString';
import { PATTERNS } from '~/consts';
import { ComposeIfTrue } from './ql/ComposeIfTrue';
import { ArrayContains } from './ql/ArrayContains';

// tslint:disable-next-line: only-arrow-functions
export const validator: FactoryContext<FactoryValidatorApi> = function (context): FactoryValidatorApi {
  // tslint:disable-next-line: only-arrow-functions
  return {
    validate(instance, schema, state) {
      const inputs = { instance, schema, state };
      // ↓↓↓↓
      const query = MethodQuery(
        {
          valid: '',
        },
        '',
      );
      // ↓↓↓↓
      const offline = 'factory.validator.validate';
      const online = {
        name: BiotaFunctionName('ValidatorValidate'),
      };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    any: {
      isAny(value) {
        const inputs = { value };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            valid: true,
          },
          q.Var('valid'),
        );
        // ↓↓↓↓
        const offline = 'factory.validator.rule.isAny';
        const online = {
          name: BiotaFunctionName('ValidatorRuleIsAny'),
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
          ValidatorCompose(q.Var('value'), q.Var('options'), q.Var('state'))(
            validator(q.Var('ctx')).string.convert,
            validator(q.Var('ctx')).string.type,
            validator(q.Var('ctx')).string.trim,
            validator(q.Var('ctx')).string.trimStart,
            validator(q.Var('ctx')).string.trimEnd,
            validator(q.Var('ctx')).string.padStart,
            validator(q.Var('ctx')).string.padEnd,
            validator(q.Var('ctx')).string.lowercase,
            validator(q.Var('ctx')).string.uppercase,
            validator(q.Var('ctx')).string.empty,
            validator(q.Var('ctx')).string.min,
            validator(q.Var('ctx')).string.max,
            validator(q.Var('ctx')).string.length,
            validator(q.Var('ctx')).string.pattern,
            validator(q.Var('ctx')).string.contains,
            validator(q.Var('ctx')).string.enum,
            validator(q.Var('ctx')).string.numeric,
            validator(q.Var('ctx')).string.alpha,
            validator(q.Var('ctx')).string.alphanum,
            validator(q.Var('ctx')).string.alphadash,
          ),
        );
        // ↓↓↓↓
        const offline = 'factory.validator.string.validate';
        const online = {
          name: BiotaFunctionName('ValidatorStringValidate'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      type(value = null, options = {}, state = {}) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            isString: q.IsString(q.Var('value')),
          },
          {
            value: q.Var('value'),
            valid: q.Var('isString'),
            stop: q.Not(q.Var('isString')),
            sanitized: false,
            errors: ValidatorErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('isString')),
                type: 'string',
                actual: q.Var('value'),
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.validator.string.type';
        const online = {
          name: BiotaFunctionName('ValidatorStringType'),
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
            errors: ValidatorErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringConvert',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.validator.string.pattern';
        const online = {
          name: BiotaFunctionName('ValidatorStringPattern'),
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
        const offline = 'factory.validator.string.trim';
        const online = {
          name: BiotaFunctionName('ValidatorStringTrim'),
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
        const offline = 'factory.validator.string.trimStart';
        const online = {
          name: BiotaFunctionName('ValidatorStringTrimStart'),
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
        const offline = 'factory.validator.string.trimEnd';
        const online = {
          name: BiotaFunctionName('ValidatorStringTrimEnd'),
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
        const offline = 'factory.validator.string.padStart';
        const online = {
          name: BiotaFunctionName('ValidatorStringPadStart'),
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
        const offline = 'factory.validator.string.padEnd';
        const online = {
          name: BiotaFunctionName('ValidatorStringPadEnd'),
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
        const offline = 'factory.validator.string.lowercase';
        const online = {
          name: BiotaFunctionName('ValidatorStringLowercase'),
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
        const offline = 'factory.validator.string.uppercase';
        const online = {
          name: BiotaFunctionName('ValidatorStringUppercase'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      empty(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasEmpty: q.Select('empty', q.Var('options'), false),
            // ↓
            valid: q.If(q.Var('hasEmpty'), q.Equals(q.Length(q.Var('value')), 0), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: ValidatorErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringEmpty',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.validator.string.empty';
        const online = {
          name: BiotaFunctionName('ValidatorStringEmpty'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      notEmpty(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasNotEmpty: q.Select('notEmpty', q.Var('options'), false),
            // ↓
            valid: q.If(q.Var('hasNotEmpty'), q.GT(q.Length(q.Var('value')), 0), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: ValidatorErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringNotEmpty',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.validator.string.notEmpty';
        const online = {
          name: BiotaFunctionName('ValidatorStringNotEmpty'),
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
            errors: ValidatorErrors(q.Var('state'), [
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
        const offline = 'factory.validator.string.min';
        const online = {
          name: BiotaFunctionName('ValidatorStringMin'),
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
            errors: ValidatorErrors(q.Var('state'), [
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
        const offline = 'factory.validator.string.max';
        const online = {
          name: BiotaFunctionName('ValidatorStringMax'),
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
            errors: ValidatorErrors(q.Var('state'), [
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
        const offline = 'factory.validator.string.length';
        const online = {
          name: BiotaFunctionName('ValidatorStringLength'),
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
            errors: ValidatorErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringPattern',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.validator.string.pattern';
        const online = {
          name: BiotaFunctionName('ValidatorStringPattern'),
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
            valid: q.If(q.Var('hasContains'), q.GT(q.Count(q.FindStrRegex(q.Var('value'), q.Var('contains'))), 0), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: ValidatorErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringContains',
                expected: q.Var('contains'),
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.validator.string.contains';
        const online = {
          name: BiotaFunctionName('ValidatorStringContains'),
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
            errors: ValidatorErrors(q.Var('state'), [
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
        const offline = 'factory.validator.string.enum';
        const online = {
          name: BiotaFunctionName('ValidatorStringEnum'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      numeric(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasNumeric: q.Select('numeric', q.Var('options'), false),
            // ↓
            valid: q.If(q.Var('hasNumeric'), q.GT(q.Length(q.ToString(q.ToNumber(q.Var('value')))), 0), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: ValidatorErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringNumeric',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.validator.string.numeric';
        const online = {
          name: BiotaFunctionName('ValidatorStringNumeric'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      alpha(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasAlpha: q.Select('alpha', q.Var('options'), false),
            // ↓
            valid: q.If(q.Var('hasAlpha'), q.GT(q.Count(q.FindStrRegex(q.Var('value'), PATTERNS.ALPHA)), 0), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: ValidatorErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringAlpha',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.validator.string.alpha';
        const online = {
          name: BiotaFunctionName('ValidatorStringAlpha'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      alphanum(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasAlphanum: q.Select('alphanum', q.Var('options'), false),
            // ↓
            valid: q.If(q.Var('hasAlphanum'), q.GT(q.Count(q.FindStrRegex(q.Var('value'), PATTERNS.ALPHANUM)), 0), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: ValidatorErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringAlphanum',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.validator.string.alphanum';
        const online = {
          name: BiotaFunctionName('ValidatorStringAlphanum'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      alphadash(value, options, state) {
        const inputs = { value, options, state };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            hasAlphadash: q.Select('alphadash', q.Var('options'), false),
            // ↓
            valid: q.If(q.Var('hasAlphadash'), q.GT(q.Count(q.FindStrRegex(q.Var('value'), PATTERNS.ALPHADASH)), 0), true),
          },
          {
            value: q.Var('value'),
            valid: q.Var('valid'),
            sanitized: false,
            errors: ValidatorErrors(q.Var('state'), [
              {
                wrong: q.Not(q.Var('valid')),
                type: 'stringAlphadash',
              },
            ]),
          },
        );
        // ↓↓↓↓
        const offline = 'factory.validator.string.alphadash';
        const online = {
          name: BiotaFunctionName('ValidatorStringAlphadash'),
        };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    },
  };
};
