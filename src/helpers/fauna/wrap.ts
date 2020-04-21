import { query as q } from 'faunadb';
import { Expr } from './Expr';
import * as values from './values';

/**
 * Wraps an object as an Expression. This will automatically wrap any bare objects with
 * the appropriate {@link object} escaping.
 * @param {Object} obj
 *  The object to be wrapped as an Expression.
 * @returns {Expr}
 *   The expression wrapping the provided object.
 * @private
 */
export function wrap(obj: any) {
  if (obj === null) {
    return null;
  } else if (obj instanceof Expr) {
    return obj;
  } else if (typeof obj === 'symbol') {
    return obj.toString().replace(/Symbol\((.*)\)/, (str, symbol) => {
      return symbol;
    });
  } else if (typeof obj === 'function') {
    return q.Lambda(obj);
  } else if (Array.isArray(obj)) {
    return new Expr(
      obj.map((elem) => {
        return wrap(elem);
      }),
    );
  } else if (obj instanceof Uint8Array || obj instanceof ArrayBuffer) {
    return new values.Bytes(obj);
  } else if (typeof obj === 'object') {
    return new Expr({ object: wrapValues(obj) });
  } else {
    return obj;
  }
}

/**
 * Wraps all of the values of a provided Object, while leaving the parent object unwrapped.
 * @param {Object} obj
 *  The object whose values are to be wrapped as Expressions.
 * @returns {Object}
 *  A copy of the provided object, with the values wrapped as Expressions.
 * @private
 */
function wrapValues(obj: { [x: string]: any }) {
  if (obj !== null) {
    const rv = {};

    Object.keys(obj).forEach((key) => {
      rv[key] = wrap(obj[key]);
    });

    return rv;
  } else {
    return null;
  }
}
