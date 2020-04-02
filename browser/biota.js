(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
module.exports = function _btoa(str) {
  return btoa(str)
}

},{}],5:[function(require,module,exports){
(function (Buffer){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this,require("buffer").Buffer)
},{"base64-js":1,"buffer":5,"ieee754":24}],6:[function(require,module,exports){
module.exports = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a teapot",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Unordered Collection",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "451": "Unavailable For Legal Reasons",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "509": "Bandwidth Limit Exceeded",
  "510": "Not Extended",
  "511": "Network Authentication Required"
}

},{}],7:[function(require,module,exports){
var __self__ = (function (root) {
function F() {
this.fetch = false;
this.DOMException = root.DOMException
}
F.prototype = root;
return new F();
})(typeof self !== 'undefined' ? self : this);
(function(self) {

var irrelevant = (function (exports) {
  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = self.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function() {
        reject(new exports.DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!self.fetch) {
    self.fetch = fetch;
    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  return exports;

}({}));
})(__self__);
delete __self__.fetch.polyfill
exports = __self__.fetch // To enable: import fetch from 'cross-fetch'
exports.default = __self__.fetch // For TypeScript consumers without esModuleInterop.
exports.fetch = __self__.fetch // To enable: import {fetch} from 'cross-fetch'
exports.Headers = __self__.Headers
exports.Request = __self__.Request
exports.Response = __self__.Response
module.exports = exports

},{}],8:[function(require,module,exports){
(function (process){
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log(...args) {
	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return typeof console === 'object' &&
		console.log &&
		console.log(...args);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = require('./common')(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};

}).call(this,require('_process'))
},{"./common":9,"_process":28}],9:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":26}],10:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],11:[function(require,module,exports){
module.exports = {
  Client: require('./src/Client'),
  Expr: require('./src/Expr'),
  PageHelper: require('./src/PageHelper'),
  RequestResult: require('./src/RequestResult'),

  clientLogger: require('./src/clientLogger'),
  errors: require('./src/errors'),
  values: require('./src/values'),
  query: require('./src/query'),
}

},{"./src/Client":12,"./src/Expr":13,"./src/PageHelper":14,"./src/RequestResult":15,"./src/clientLogger":18,"./src/errors":19,"./src/query":20,"./src/values":21}],12:[function(require,module,exports){
'use strict'

var APIVersion = '2.7'

var btoa = require('btoa-lite')
var errors = require('./errors')
var query = require('./query')
var values = require('./values')
var json = require('./_json')
var RequestResult = require('./RequestResult')
var util = require('./_util')
var PageHelper = require('./PageHelper')
var parse = require('url-parse')

/**
 * The callback that will be executed after every completed request.
 *
 * @callback Client~observerCallback
 * @param {RequestResult} res
 */

/**
 * A client for interacting with FaunaDB.
 *
 * Users will mainly call the {@link Client#query} method to execute queries.
 *
 * See the [FaunaDB Documentation](https://fauna.com/documentation) for detailed examples.
 *
 * All methods return promises containing a JSON object that represents the FaunaDB response.
 * Literal types in the response object will remain as strings, Arrays, and objects.
 * FaunaDB types, such as {@link Ref}, {@link SetRef}, {@link FaunaTime}, and {@link FaunaDate} will
 * be converted into the appropriate object.
 *
 * (So if a response contains `{ "@ref": "collections/frogs/123" }`,
 * it will be returned as `new Ref("collections/frogs/123")`.)
 *
 * @constructor
 * @param {?Object} options
 *   Object that configures this FaunaDB client.
 * @param {?string} options.domain
 *   Base URL for the FaunaDB server.
 * @param {?{ string: string }} options.headers
 *   Base URL for the FaunaDB server.
 * @param {?('http'|'https')} options.scheme
 *   HTTP scheme to use.
 * @param {?number} options.port
 *   Port of the FaunaDB server.
 * @param {?string} options.secret FaunaDB secret (see [Reference Documentation](https://app.fauna.com/documentation/intro/security))
 * @param {?number} options.timeout Read timeout in seconds.
 * @param {?Client~observerCallback} options.observer
 *   Callback that will be called after every completed request.
 * @param {?boolean} options.keepAlive
 *   Configures http/https keepAlive option (ignored in browser environments)
 * @param {?fetch} options.fetch
 *   a fetch compatible [API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for making a request
 */
function Client(options) {
  var isNodeEnv = typeof window === 'undefined'
  var opts = util.applyDefaults(options, {
    domain: 'db.fauna.com',
    scheme: 'https',
    port: null,
    secret: null,
    timeout: 60,
    observer: null,
    keepAlive: true,
    headers: {},
    fetch: undefined,
  })
  var isHttps = opts.scheme === 'https'

  if (opts.port === null) {
    opts.port = isHttps ? 443 : 80
  }

  this._baseUrl = opts.scheme + '://' + opts.domain + ':' + opts.port
  this._timeout = Math.floor(opts.timeout * 1000)
  this._secret = opts.secret
  this._observer = opts.observer
  this._lastSeen = null
  this._headers = opts.headers
  this._fetch = opts.fetch || require('cross-fetch')

  if (isNodeEnv && opts.keepAlive) {
    this._keepAliveEnabledAgent = new (isHttps
      ? require('https')
      : require('http')
    ).Agent({ keepAlive: true })
  }
}

/**
 * Executes a query via the FaunaDB Query API.
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi),
 * and the query functions in this documentation.
 * @param expression {Expr}
 *   The query to execute. Created from query functions such as {@link add}.
 * @param {?Object} options
 *   Object that configures the current query, overriding FaunaDB client options.
 * @param {?string} options.secret FaunaDB secret (see [Reference Documentation](https://app.fauna.com/documentation/intro/security))
 * @return {external:Promise<Object>} FaunaDB response object.
 */

Client.prototype.query = function(expression, options) {
  return this._execute('POST', '', query.wrap(expression), null, options)
}

/**
 * Returns a {@link PageHelper} for the given Query expression.
 * This provides a helpful API for paginating over FaunaDB responses.
 * @param expression {Expr}
 *   The Query expression to paginate over.
 * @param params {Object}
 *   Options to be passed to the paginate function. See [paginate](https://app.fauna.com/documentation/reference/queryapi#read-functions).
 * @param options {?Object}
 *   Object that configures the current pagination queries, overriding FaunaDB client options.
 * @param {?string} options.secret FaunaDB secret (see [Reference Documentation](https://app.fauna.com/documentation/intro/security))
 * @returns {PageHelper} A PageHelper that wraps the provided expression.
 */
Client.prototype.paginate = function(expression, params, options) {
  params = defaults(params, {})
  options = defaults(options, {})

  return new PageHelper(this, expression, params, options)
}

/**
 * Sends a `ping` request to FaunaDB.
 * @return {external:Promise<string>} Ping response.
 */
Client.prototype.ping = function(scope, timeout) {
  return this._execute('GET', 'ping', null, { scope: scope, timeout: timeout })
}

/**
 * Get the freshest timestamp reported to this client.
 * @returns {number} the last seen transaction time
 */
Client.prototype.getLastTxnTime = function() {
  return this._lastSeen
}

/**
 * Sync the freshest timestamp seen by this client.
 *
 * This has no effect if staler than currently stored timestamp.
 * WARNING: This should be used only when coordinating timestamps across
 *          multiple clients. Moving the timestamp arbitrarily forward into
 *          the future will cause transactions to stall.
 * @param time {number} the last seen transaction time
 */
Client.prototype.syncLastTxnTime = function(time) {
  if (this._lastSeen == null || this._lastSeen < time) {
    this._lastSeen = time
  }
}

Client.prototype._execute = function(method, path, data, query, options) {
  query = defaults(query, null)

  if (path instanceof values.Ref) {
    path = path.value
  }

  if (query !== null) {
    query = util.removeUndefinedValues(query)
  }

  var startTime = Date.now()
  var self = this
  var body =
    ['GET', 'HEAD'].indexOf(method) >= 0 ? undefined : JSON.stringify(data)

  return this._performRequest(method, path, body, query, options).then(function(
    response
  ) {
    var endTime = Date.now()
    var responseText = response.text
    var responseObject = json.parseJSON(responseText)
    var requestResult = new RequestResult(
      method,
      path,
      query,
      body,
      data,
      responseText,
      responseObject,
      response.status,
      responseHeadersAsObject(response),
      startTime,
      endTime
    )
    var txnTimeHeaderKey = 'x-txn-time'

    if (response.headers.has(txnTimeHeaderKey)) {
      self.syncLastTxnTime(parseInt(response.headers.get(txnTimeHeaderKey), 10))
    }

    if (self._observer != null) {
      self._observer(requestResult, self)
    }

    errors.FaunaHTTPError.raiseForStatusCode(requestResult)
    return responseObject['resource']
  })
}

Client.prototype._performRequest = function(
  method,
  path,
  body,
  query,
  options
) {
  var url = parse(this._baseUrl)
  url.set('pathname', path)
  url.set('query', query)
  options = defaults(options, {})
  const secret = options.secret || this._secret

  return this._fetch(url.href, {
    agent: this._keepAliveEnabledAgent,
    body: body,
    headers: util.removeNullAndUndefinedValues({
      ...this._headers,
      Authorization: secret && secretHeader(secret),
      'X-FaunaDB-API-Version': APIVersion,
      'X-Fauna-Driver': 'Javascript',
      'X-Last-Seen-Txn': this._lastSeen,
    }),
    method: method,
    timeout: this._timeout,
  }).then(function(response) {
    return response.text().then(function(text) {
      response.text = text
      return response
    })
  })
}

function defaults(obj, def) {
  if (obj === undefined) {
    return def
  } else {
    return obj
  }
}

function secretHeader(secret) {
  return 'Basic ' + btoa(secret + ':')
}

function responseHeadersAsObject(response) {
  let headers = {}

  for (const [key, value] of response.headers.entries()) {
    headers[key] = value
  }

  return headers
}

module.exports = Client

},{"./PageHelper":14,"./RequestResult":15,"./_json":16,"./_util":17,"./errors":19,"./query":20,"./values":21,"btoa-lite":4,"cross-fetch":7,"http":35,"https":23,"url-parse":55}],13:[function(require,module,exports){
'use strict'

/**
 * A representation of a FaunaDB Query Expression. Generally, you shouldn't need
 * to use this class directly; use the Query helpers defined in {@link module:query}.
 *
 * @param {Object} obj The object that represents a Query to be treated as an Expression.
 * @constructor
 */
function Expr(obj) {
  this.raw = obj
}

Expr.prototype.toJSON = function() {
  return this.raw
}

var varArgsFunctions = [
  'Do',
  'Call',
  'Union',
  'Intersection',
  'Difference',
  'Equals',
  'Add',
  'BitAnd',
  'BitOr',
  'BitXor',
  'Divide',
  'Max',
  'Min',
  'Modulo',
  'Multiply',
  'Subtract',
  'LT',
  'LTE',
  'GT',
  'GTE',
  'And',
  'Or',
]
var specialCases = {
  is_nonempty: 'is_non_empty',
  lt: 'LT',
  lte: 'LTE',
  gt: 'GT',
  gte: 'GTE',
}

var exprToString = function(expr, caller) {
  if (expr instanceof Expr) {
    if ('value' in expr) return expr.toString()

    expr = expr.raw
  }

  var type = typeof expr

  if (type === 'string') {
    return JSON.stringify(expr)
  }

  if (type === 'symbol' || type === 'number' || type === 'boolean') {
    return expr.toString()
  }

  if (type === 'undefined') {
    return 'undefined'
  }

  if (expr === null) {
    return 'null'
  }

  var printObject = function(obj) {
    return (
      '{' +
      Object.keys(obj)
        .map(function(k) {
          return k + ': ' + exprToString(obj[k])
        })
        .join(', ') +
      '}'
    )
  }

  var printArray = function(array, toStr) {
    return array
      .map(function(item) {
        return toStr(item)
      })
      .join(', ')
  }

  if (Array.isArray(expr)) {
    var array = printArray(expr, exprToString)

    return varArgsFunctions.indexOf(caller) != -1 ? array : '[' + array + ']'
  }

  if ('let' in expr && 'in' in expr) {
    var letExpr = ''

    if (Array.isArray(expr['let']))
      letExpr = '[' + printArray(expr['let'], printObject) + ']'
    else letExpr = printObject(expr['let'])

    return 'Let(' + letExpr + ', ' + exprToString(expr['in']) + ')'
  }

  if ('object' in expr) return printObject(expr['object'])

  var keys = Object.keys(expr)
  var fn = keys[0]

  if (fn in specialCases) fn = specialCases[fn]

  fn = fn
    .split('_')
    .map(function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    })
    .join('')

  var args = keys.map(function(k) {
    var v = expr[k]
    return exprToString(v, fn)
  })

  var shouldReverseArgs = ['filter', 'map', 'foreach'].some(function(fn) {
    return fn in expr
  })

  if (shouldReverseArgs) {
    args.reverse()
  }

  args = args.join(', ')

  return fn + '(' + args + ')'
}

Expr.toString = exprToString

module.exports = Expr

},{}],14:[function(require,module,exports){
'use strict'

var query = require('./query')
var objectAssign = require('object-assign')

/**
 * A FaunaDB Lambda expression to be passed into one of the collection
 * functions: Map or Filter.
 *
 * @callback PageHelper~collectionFunction
 * @param {any} var
 *   The variable passed in by FaunaDB when this Lambda
 *   function is executed.
 * @return {Expr}
 *   The FaunaDB query expression to be returned by this Lambda.
 */

/**
 * @callback PageHelper~eachFunction
 * @param {Object} page
 *   A page returned by FaunaDB's Paginate function.
 */

/**
 * A wrapper that provides a helpful API for consuming FaunaDB pages.
 *
 * Generally this is constructed through the {@link Client#paginate} method.
 *
 * The {@link PageHelper#map} and {@link PageHelper#filter} methods will wrap the underlying query with a Map
 * and Filter query function, respectively. These will be executed on the server when a promise-returning function
 * is called.
 *
 * The {@link PageHelper#each} and {@link PageHelper#eachReverse} functions dispatch queries to FaunaDB, and return Promises
 * representing the completion of those queries. The callbacks provided to these functions are executed locally when the
 * queries return.
 *
 * The {@link PageHelper#nextPage} and {@link PageHelper#previousPage} functions also dispatch queries to FaunaDB,
 * but return their responses in a wrapped Promise.
 *
 * @param {Client} client
 *   The FaunaDB client used to paginate.
 * @param {Object} set
 *   The set to paginate.
 * @param {?Object} params
 *   Parameters to be passed to the FaunaDB Paginate function.
 * @param {?Object} options
 *   Object that configures the current pagination, overriding FaunaDB client options.
 * @param {?string} options.secret FaunaDB secret (see [Reference Documentation](https://app.fauna.com/documentation/intro/security))
 * @constructor
 */
function PageHelper(client, set, params, options) {
  if (params === undefined) {
    params = {}
  }

  if (options === undefined) {
    options = {}
  }

  this.reverse = false
  this.params = {}

  this.before = undefined
  this.after = undefined

  objectAssign(this.params, params)

  var cursorParams = this.params.cursor || this.params

  if ('before' in cursorParams) {
    this.before = cursorParams.before
    delete cursorParams.before
  } else if ('after' in cursorParams) {
    this.after = cursorParams.after
    delete cursorParams.after
  }

  this.options = {}
  objectAssign(this.options, options)

  this.client = client
  this.set = set

  /**
   * @member {Array.<Function>}
   * @type {Array.<Function>}
   * @private
   */
  this._faunaFunctions = []
}

/**
 * Wraps the set to be paginated with a FaunaDB Map function.
 * As this function is executed on the server, the `lambda` param must
 * return a valid query expression.
 *
 * @param {PageHelper~collectionFunction} lambda
 *   The Lambda expression to be passed into the Map function.
 * @return {PageHelper}
 *
 */
PageHelper.prototype.map = function(lambda) {
  var rv = this._clone()
  rv._faunaFunctions.push(function(q) {
    return query.Map(q, lambda)
  })
  return rv
}

/**
 * Wraps the set to be paginated with a FaunaDB Filter funciton.
 * As this function is executed on the server, the `lambda` param must
 * return a valid query expression.
 *
 * @param {PageHelper~collectionFunction} lambda
 *   The lambda expression to be passed into the Filter function.
 * @return {PageHelper}
 */
PageHelper.prototype.filter = function(lambda) {
  var rv = this._clone()
  rv._faunaFunctions.push(function(q) {
    return query.Filter(q, lambda)
  })
  return rv
}

/**
 * Executes the provided function for each page.
 *
 * @param {PageHelper~eachFunction} lambda
 *   A function to be executed for each page.
 * @returns {external:Promise.<void>}
 */
PageHelper.prototype.each = function(lambda) {
  return this._retrieveNextPage(this.after, false).then(
    this._consumePages(lambda, false)
  )
}

/**
 * Executes the provided function for each page, in the reverse direction.
 * @param {PageHelper~eachFunction} lambda
 * @returns {external:Promise.<void>}
 */
PageHelper.prototype.eachReverse = function(lambda) {
  return this._retrieveNextPage(this.before, true).then(
    this._consumePages(lambda, true)
  )
}

/**
 * Queries for the previous page from the current cursor point; this mutates
 * the state of the PageHelper when the query completes, updating the internal
 * cursor state to that of the returned page.
 *
 * @returns {external:Promise.<object>}
 */
PageHelper.prototype.previousPage = function() {
  var self = this
  return this._retrieveNextPage(this.before, true).then(
    this._adjustCursors.bind(self)
  )
}

/**
 * Queries for the next page from the current cursor point; this mutates
 * the state of the PageHelper when the query completes, updating the internal
 * cursor state to that of the returned page.
 *
 * @returns {external:Promise.<object>}
 */
PageHelper.prototype.nextPage = function() {
  var self = this
  return this._retrieveNextPage(this.after, false).then(
    this._adjustCursors.bind(self)
  )
}

PageHelper.prototype._adjustCursors = function(page) {
  if (page.after !== undefined) {
    this.after = page.after
  }

  if (page.before !== undefined) {
    this.before = page.before
  }

  return page.data
}

PageHelper.prototype._consumePages = function(lambda, reverse) {
  var self = this
  return function(page) {
    var data = []
    page.data.forEach(function(item) {
      if (item.document) {
        item.instance = item.document
      }
      if (item.value && item.value.document) {
        item.value.instance = item.value.document
      }
      data.push(item)
    })
    lambda(data)

    var nextCursor
    if (reverse) {
      nextCursor = page.before
    } else {
      nextCursor = page.after
    }

    if (nextCursor !== undefined) {
      return self
        ._retrieveNextPage(nextCursor, reverse)
        .then(self._consumePages(lambda, reverse))
    } else {
      return Promise.resolve()
    }
  }
}

/**
 *
 * @returns {external:Promise.<Object>}
 * @private
 */
PageHelper.prototype._retrieveNextPage = function(cursor, reverse) {
  var opts = {}
  objectAssign(opts, this.params)
  var cursorOpts = opts.cursor || opts

  if (cursor !== undefined) {
    if (reverse) {
      cursorOpts.before = cursor
    } else {
      cursorOpts.after = cursor
    }
  } else {
    if (reverse) {
      cursorOpts.before = null
    }
  }

  var q = query.Paginate(this.set, opts)

  if (this._faunaFunctions.length > 0) {
    this._faunaFunctions.forEach(function(lambda) {
      q = lambda(q)
    })
  }

  return this.client.query(q, this.options)
}

/**
 * @private
 * @returns {PageHelper}
 */
PageHelper.prototype._clone = function() {
  return Object.create(PageHelper.prototype, {
    client: { value: this.client },
    set: { value: this.set },
    _faunaFunctions: { value: this._faunaFunctions },
    before: { value: this.before },
    after: { value: this.after },
  })
}

module.exports = PageHelper

},{"./query":20,"object-assign":27}],15:[function(require,module,exports){
'use strict'

/**
 * A structure containing the request and response context for a given FaunaDB request.
 * Provided to an observer function optionally defined in the {@link Client} constructor.
 *
 * @param {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'} method
 *   The HTTP method used in the request.
 * @param {string} path
 *   The path that was queried. Relative to the client's domain.
 * @param {string} query
 *   URL query parameters. Only set if `method` is "GET".
 * @param {Object} requestRaw
 *   The JSON request string.
 * @param {Object} requestContent
 *   The request data.
 * @param {string} responseRaw
 *   The unparsed response data, as a string.
 * @param {object} responseContent
 *   The response data parsed as JSON.
 * @param {number} statusCode
 *   The HTTP response status code.
 * @param {object} responseHeaders
 *   The HTTP headers returned in the response.
 * @param {number} startTime
 *   The time the request was issued by the client.
 * @param {number} endTime
 *   The time the response was received by the client.
 * @constructor
 */
function RequestResult(
  method,
  path,
  query,
  requestRaw,
  requestContent,
  responseRaw,
  responseContent,
  statusCode,
  responseHeaders,
  startTime,
  endTime
) {
  /** @type {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'} */
  this.method = method

  /** @type {string} */
  this.path = path

  /**
   * URL query. Null unless `method == 'get'`.
   * *Not* related to {@link Client.query}.
   * @type {object}
   */
  this.query = query

  /** @type {string} */
  this.requestRaw = requestRaw

  /** @type {object} */
  this.requestContent = requestContent

  /** @type {string} */
  this.responseRaw = responseRaw

  /**
   * Parsed value returned by the server.
   * Includes "resource" wrapper dict, or may be an "errors" dict instead.
   * @type {object}
   */
  this.responseContent = responseContent

  /** @type {number} */
  this.statusCode = statusCode

  /** @type {object} */
  this.responseHeaders = responseHeaders

  /** @type {number} */
  this.startTime = startTime

  /** @type {number} */
  this.endTime = endTime
}

/**
 * `this.endTime - this.startTime`: Time taken in milliseconds.
 * @type {number}
 */
Object.defineProperty(RequestResult.prototype, 'timeTaken', {
  get: function() {
    return this.endTime - this.startTime
  },
})

module.exports = RequestResult

},{}],16:[function(require,module,exports){
'use strict'

var values = require('./values')

function toJSON(object, pretty) {
  pretty = typeof pretty !== 'undefined' ? pretty : false

  if (pretty) {
    return JSON.stringify(object, null, '  ')
  } else {
    return JSON.stringify(object)
  }
}

function parseJSON(json) {
  return JSON.parse(json, json_parse)
}

function json_parse(_, val) {
  if (typeof val !== 'object' || val === null) {
    return val
  } else if ('@ref' in val) {
    var ref = val['@ref']

    if (!('collection' in ref) && !('database' in ref)) {
      return values.Native.fromName(ref['id'])
    }

    var col = json_parse('collection', ref['collection'])
    var db = json_parse('database', ref['database'])

    return new values.Ref(ref['id'], col, db)
  } else if ('@obj' in val) {
    return val['@obj']
  } else if ('@set' in val) {
    return new values.SetRef(val['@set'])
  } else if ('@ts' in val) {
    return new values.FaunaTime(val['@ts'])
  } else if ('@date' in val) {
    return new values.FaunaDate(val['@date'])
  } else if ('@bytes' in val) {
    return new values.Bytes(val['@bytes'])
  } else if ('@query' in val) {
    return new values.Query(val['@query'])
  } else {
    return val
  }
}

module.exports = {
  toJSON: toJSON,
  parseJSON: parseJSON,
}

},{"./values":21}],17:[function(require,module,exports){
'use strict'

/**
 * Used for functions that take an options objects.
 * Fills in defaults for options not provided.
 * Throws errors for provided options that aren't recognized.
 * A default value of `undefined` is used to indicate that the option must be provided.
 * @private
 */
function applyDefaults(provided, defaults) {
  var out = {}

  for (var providedKey in provided) {
    if (!(providedKey in defaults)) {
      throw new Error('No such option ' + providedKey)
    }
    out[providedKey] = provided[providedKey]
  }

  for (var defaultsKey in defaults) {
    if (!(defaultsKey in out)) {
      out[defaultsKey] = defaults[defaultsKey]
    }
  }

  return out
}

/**
 * Returns a new object without any keys where the value would be null or undefined.
 * @private
 * */
function removeNullAndUndefinedValues(object) {
  var res = {}
  for (var key in object) {
    var val = object[key]
    if (val !== null && val !== undefined) {
      res[key] = val
    }
  }
  return res
}

/**
 * Returns a new object without any keys where the value would be undefined.
 * @private
 * */
function removeUndefinedValues(object) {
  var res = {}
  for (var key in object) {
    var val = object[key]
    if (val !== undefined) {
      res[key] = val
    }
  }
  return res
}

module.exports = {
  applyDefaults: applyDefaults,
  removeNullAndUndefinedValues: removeNullAndUndefinedValues,
  removeUndefinedValues: removeUndefinedValues,
}

},{}],18:[function(require,module,exports){
'use strict'

var json = require('./_json')

/**
 * Functions to assist with debug logging.
 * @module clientLogger
 */

/**
 * A user provided log line handler.
 *
 * @callback loggerCallback
 * @param {string} logged
 */

/**
 * Function that can be the `observer` for a {@link Client}.
 * Will call `loggerFunction` with a string representation of each {@link RequestResult}.
 *
 * An example logging string:
 * ```plain
 * Fauna POST /
 * Request JSON: {
 *   "data": ...
 * }
 * Response headers: {
 *    "x-faunadb-host": ...,
 *    "x-faunadb-build": ...,
 *    "connection": "close",
 *    "content-length": ...,
 *    "content-type": "application/json;charset=utf-8"
 *  }
 * Response JSON: {
 *    "resource": {
 *      "ref": { ... },
 *      "class": { ... },
 *      "ts": ...
 *    }
 *  }
 * Response (201): Network latency 13ms
 * ```
 *
 * @param {loggerCallback} loggerFunction
 * @return {Client~observerCallback}
 * @example
 * var client = new Client({
 *   ... other options ...
 *   observer: logger(console.log)
 * })
 * client.ping() // Logs the request and response.
 */
function logger(loggerFunction) {
  return function(requestResult, client) {
    return loggerFunction(showRequestResult(requestResult), client)
  }
}

/**
 * Convenience function used by {@link logger} to transform a {@link RequestResult}
 * to a string for logging.
 * @param {RequestResult} requestResult
 * @returns {string} string to be logged.
 */
function showRequestResult(requestResult) {
  var query = requestResult.query,
    method = requestResult.method,
    path = requestResult.path,
    requestContent = requestResult.requestContent,
    responseHeaders = requestResult.responseHeaders,
    responseContent = requestResult.responseContent,
    statusCode = requestResult.statusCode,
    timeTaken = requestResult.timeTaken

  var out = ''

  function log(str) {
    out = out + str
  }

  log('Fauna ' + method + ' /' + path + _queryString(query) + '\n')
  if (requestContent != null) {
    log('  Request JSON: ' + _showJSON(requestContent) + '\n')
  }
  log('  Response headers: ' + _showJSON(responseHeaders) + '\n')
  log('  Response JSON: ' + _showJSON(responseContent) + '\n')
  log('  Response (' + statusCode + '): Network latency ' + timeTaken + 'ms\n')

  return out
}

function _indent(str) {
  var indentStr = '  '
  return str.split('\n').join('\n' + indentStr)
}

function _showJSON(object) {
  return _indent(json.toJSON(object, true))
}

function _queryString(query) {
  if (query == null) {
    return ''
  }

  var keys = Object.keys(query)
  if (keys.length === 0) {
    return ''
  }

  var pairs = keys.map(function(key) {
    return key + '=' + query[key]
  })
  return '?' + pairs.join('&')
}

module.exports = {
  logger: logger,
  showRequestResult: showRequestResult,
}

},{"./_json":16}],19:[function(require,module,exports){
'use strict'

var util = require('util')

/**
 * FaunaDB error types. Request errors can originate from
 * the client (e.g. bad method parameters) or from the FaunaDB Server (e.g.
 * invalid queries, timeouts.) Server errors will subclass
 * {@link module:errors~FaunaHTTPError}.
 *
 * @module errors
 */

/**
 * The base exception type for all FaunaDB errors.
 *
 * @param {string} message
 * @extends Error
 * @constructor
 */
function FaunaError(name, message) {
  Error.call(this)

  /**
   * Name of this exception.
   * @type {string}
   */
  this.name = name

  /**
   * Message for this exception.
   * @type {string}
   */
  this.message = message
}

util.inherits(FaunaError, Error)

/**
 * Exception thrown by this client library when an invalid
 * value is provided as a function argument.
 *
 * @extends module:errors~FaunaError
 * @constructor
 */
function InvalidValue(message) {
  FaunaError.call(this, 'InvalidValue', message)
}

util.inherits(InvalidValue, FaunaError)

/**
 * Exception thrown by this client library when an invalid
 * value is provided as a function argument.
 *
 * @extends module:errors~FaunaError
 * @constructor
 */
function InvalidArity(min, max, actual, callerFunc) {
  const arityInfo = `${callerFunc} function requires ${messageForArity(
    min,
    max
  )} argument(s) but ${actual} were given`
  const documentationLink = logDocumentationLink(callerFunc)

  FaunaError.call(this, 'InvalidArity', `${arityInfo}\n${documentationLink}`)

  /**
   * Minimum number of arguments.
   * @type {number}
   */
  this.min = min

  /**
   * Maximum number of arguments.
   * @type {number}
   */
  this.max = max

  /**
   * Actual number of arguments called with.
   * @type {number}
   */
  this.actual = actual

  function messageForArity(min, max) {
    if (max === null) return 'at least ' + min
    if (min === null) return 'up to ' + max
    if (min === max) return min
    return 'from ' + min + ' to ' + max
  }

  function logDocumentationLink(functionName) {
    const docsURL = 'https://docs.fauna.com/fauna/current/api/fql/functions/'
    return `For more info, see the docs: ${docsURL}${functionName.toLowerCase()}`
  }
}

util.inherits(InvalidArity, FaunaError)

/**
 * Base exception type for errors returned by the FaunaDB server.
 *
 * @param {RequestResult} requestResult
 *
 * @extends module:errors~FaunaError
 * @constructor
 */
function FaunaHTTPError(name, requestResult) {
  var response = requestResult.responseContent
  var errors = response.errors
  var message = errors.length === 0 ? '(empty "errors")' : errors[0].code
  FaunaError.call(this, name, message)

  /**
   * A wrapped {@link RequestResult} object, containing the request and response
   * context of the failed request.
   *
   * @type {RequestResult}
   */
  this.requestResult = requestResult
}

util.inherits(FaunaHTTPError, FaunaError)

/**
 * Convenience method to return the errors from the response object.
 *
 * @returns {Object}
 */
FaunaHTTPError.prototype.errors = function() {
  return this.requestResult.responseContent.errors
}

/**
 * Takes a {@link RequestResult} and throws an appropriate exception if
 * it contains a failed request.
 *
 * @param requestResult {RequestResult}
 */
FaunaHTTPError.raiseForStatusCode = function(requestResult) {
  var code = requestResult.statusCode
  if (code < 200 || code >= 300) {
    switch (code) {
      case 400:
        throw new BadRequest(requestResult)
      case 401:
        throw new Unauthorized(requestResult)
      case 403:
        throw new PermissionDenied(requestResult)
      case 404:
        throw new NotFound(requestResult)
      case 405:
        throw new MethodNotAllowed(requestResult)
      case 500:
        throw new InternalError(requestResult)
      case 503:
        throw new UnavailableError(requestResult)
      default:
        throw new FaunaHTTPError('UnknownError', requestResult)
    }
  }
}

/**
 * A HTTP 400 error.
 *
 * @param {RequestResult} requestResult
 * @extends module:errors~FaunaHTTPError
 * @constructor
 */
function BadRequest(requestResult) {
  FaunaHTTPError.call(this, 'BadRequest', requestResult)
}

util.inherits(BadRequest, FaunaHTTPError)

/**
 * A HTTP 401 error.
 * @param {RequestResult} requestResult
 * @extends module:errors~FaunaHTTPError
 * @constructor
 */
function Unauthorized(requestResult) {
  FaunaHTTPError.call(this, 'Unauthorized', requestResult)
}

util.inherits(Unauthorized, FaunaHTTPError)

/**
 * A HTTP 403 error.
 * @param {RequestResult} requestResult
 * @extends module:errors~FaunaHTTPError
 * @constructor
 */
function PermissionDenied(requestResult) {
  FaunaHTTPError.call(this, 'PermissionDenied', requestResult)
}

util.inherits(PermissionDenied, FaunaHTTPError)

/**
 * A HTTP 404 error.
 * @param {RequestResult} requestResult
 * @extends module:errors~FaunaHTTPError
 * @constructor
 */
function NotFound(requestResult) {
  FaunaHTTPError.call(this, 'NotFound', requestResult)
}

util.inherits(NotFound, FaunaHTTPError)

/**
 * A HTTP 405 error.
 * @param {RequestResult} requestResult
 * @extends module:errors~FaunaHTTPError
 * @constructor
 */
function MethodNotAllowed(requestResult) {
  FaunaHTTPError.call(this, 'MethodNotAllowed', requestResult)
}

util.inherits(MethodNotAllowed, FaunaHTTPError)

/**
 * A HTTP 500 error.
 * @param {RequestResult} requestResult
 * @extends module:errors~FaunaHTTPError
 * @constructor
 */
function InternalError(requestResult) {
  FaunaHTTPError.call(this, 'InternalError', requestResult)
}

util.inherits(InternalError, FaunaHTTPError)

/**
 * A HTTP 503 error.
 * @param {RequestResult} requestResult
 * @extends module:errors~FaunaHTTPError
 * @constructor
 */
function UnavailableError(requestResult) {
  FaunaHTTPError.call(this, 'UnavailableError', requestResult)
}

util.inherits(UnavailableError, FaunaHTTPError)

module.exports = {
  FaunaHTTPError: FaunaHTTPError,
  InvalidValue: InvalidValue,
  InvalidArity: InvalidArity,
  BadRequest: BadRequest,
  Unauthorized: Unauthorized,
  PermissionDenied: PermissionDenied,
  NotFound: NotFound,
  MethodNotAllowed: MethodNotAllowed,
  InternalError: InternalError,
  UnavailableError: UnavailableError,
}

},{"util":61}],20:[function(require,module,exports){
'use strict'

var annotate = require('fn-annotate')
var deprecate = require('util-deprecate')
var Expr = require('./Expr')
var errors = require('./errors')
var values = require('./values')
var objectAssign = require('object-assign')

/**
 * This module contains functions used to construct FaunaDB Queries.
 *
 * See the [FaunaDB Query API Documentation](https://app.fauna.com/documentation/reference/queryapi)
 * for per-function documentation.
 *
 * @module query
 */

/**
 * @typedef {(Expr|string|number|boolean|Object)} module:query~ExprTerm
 */

/**
 * @typedef {(module:query~ExprTerm|Array<module:query~ExprTerm>)} module:query~ExprArg
 */

// Type helpers

/**
 * If one parameter is provided, constructs a literal Ref value.
 * The string `collections/widget/123` will be equivalent to `new values.Ref('123', new values.Ref('widget', values.Native.COLLECTIONS))`
 *
 * If two are provided, constructs a Ref() function that, when evaluated, returns a Ref value.
 *
 * @param {string|module:query~ExprArg} ref|cls
 *   Alone, the ref in path form. Combined with `id`, must be a collection ref.
 * @param {module:query~ExprArg} [id]
 *   A numeric id of the given collection.
 * @return {Expr}
 */
function Ref() {
  arity.between(1, 2, arguments, Ref.name)
  switch (arguments.length) {
    case 1:
      return new Expr({ '@ref': wrap(arguments[0]) })
    case 2:
      return new Expr({ ref: wrap(arguments[0]), id: wrap(arguments[1]) })
  }
}

/**
 * @param {Uint8Array|ArrayBuffer|module:query~ExprArg} bytes
 *   A base64 encoded string or a byte array
 * @return {Expr}
 */
function Bytes(bytes) {
  arity.exact(1, arguments, Bytes.name)
  return new values.Bytes(bytes)
}

// Basic forms

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#basic-forms).
 *
 * @param {module:query~ExprArg} msg
 *   The message to send back to the client.
 * @return {Expr}
 * */
function Abort(msg) {
  arity.exact(1, arguments, Abort.name)
  return new Expr({ abort: wrap(msg) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#basic-forms).
 *
 * @param {module:query~ExprArg} timestamp
 *   An Expr that will evaluate to a Time.
 * @param {module:query~ExprArg} expr
 *   The Expr to run at the given snapshot time.
 * @return {Expr}
 * */
function At(timestamp, expr) {
  arity.exact(2, arguments, At.name)
  return new Expr({ at: wrap(timestamp), expr: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#basic-forms).
 *
 * @param {module:query~ExprArg} bindings
 *   A set of bindings to use within the given expression.
 * @param {module:query~ExprArg} in
 *   The expression to run with the given bindings.
 * @return {Expr}
 * */
function Let(vars, expr) {
  arity.exact(2, arguments, Let.name)
  var bindings = []

  if (Array.isArray(vars)) {
    bindings = vars.map(function(item) {
      return wrapValues(item)
    })
  } else {
    bindings = Object.keys(vars).map(function(k) {
      var b = {}
      b[k] = wrap(vars[k])
      return b
    })
  }

  if (typeof expr === 'function') {
    if (Array.isArray(vars)) {
      var expr_vars = []

      vars.forEach(function(item) {
        Object.keys(item).forEach(function(name) {
          expr_vars.push(Var(name))
        })
      })

      expr = expr.apply(null, expr_vars)
    } else {
      expr = expr.apply(
        null,
        Object.keys(vars).map(function(name) {
          return Var(name)
        })
      )
    }
  }

  return new Expr({ let: bindings, in: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#basic-forms).
 *
 * @param {module:query~ExprArg} varName
 *   The name of the bound var.
 * @return {Expr}
 * */
function Var(varName) {
  arity.exact(1, arguments, Var.name)
  return new Expr({ var: wrap(varName) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#basic-forms).
 *
 * @param {module:query~ExprArg} condition
 *   An expression that returns a boolean.
 * @param {module:query~ExprArg} then
 *   The expression to run if condition is true.
 * @param {module:query~ExprArg} else
 *   The expression to run if the condition is false.
 * @return {Expr}
 * */
function If(condition, then, _else) {
  arity.exact(3, arguments, If.name)
  return new Expr({ if: wrap(condition), then: wrap(then), else: wrap(_else) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#basic-forms).
 *
 * @param {...module:query~ExprArg} args
 *   A series of expressions to run.
 * @return {Expr}
 * */
function Do() {
  arity.min(1, arguments, Do.name)
  var args = argsToArray(arguments)
  return new Expr({ do: wrap(args) })
}

/** See the [docs](https://app.fauna.com/documentation/reference/queryapi#basic-forms).
 *
 * @param {...module:query~ExprArg} fields
 *   The object to be escaped.
 * @return {Expr}
 * */
var objectFunction = function(fields) {
  arity.exact(1, arguments, objectFunction.name)
  return new Expr({ object: wrapValues(fields) })
}
/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#basic-forms).
 *
 * Directly produces a FaunaDB Lambda expression as described in the FaunaDB reference
 * documentation.
 *
 * @param {module:query~ExprArg} var
 *   The names of the variables to be bound in this lambda expression.
 * @param {module:query~ExprArg} expr
 *   The lambda expression.
 * @return {Expr}
 */

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#basic-forms).
 *
 * Takes a Javascript function, and will transform it
 * into the appropriate FaunaDB query. For example:
 *
 * ```
 * Lambda(function(a) { return Add(a, a); });
 * // Returns { lambda: 'a', expr: { add: [{ var: a }, { var: a }] } }
 * ```
 * Note that the driver will handle wrapping all usages of the lambda's bound
 * variables with the {@link modules:query~Var} function.
 *
 * @param {function} func
 *   Takes the provided function and produces the appropriate FaunaDB query expression.
 * @return {Expr}
 *
 */ function Lambda() {
  arity.between(1, 2, arguments, Lambda.name)
  switch (arguments.length) {
    case 1:
      var value = arguments[0]
      if (typeof value === 'function') {
        return _lambdaFunc(value)
      } else if (value instanceof Expr) {
        return value
      } else {
        throw new errors.InvalidValue(
          'Lambda function takes either a Function or an Expr.'
        )
      }
    case 2:
      var var_name = arguments[0]
      var expr = arguments[1]

      return _lambdaExpr(var_name, expr)
  }
}

/**
 * @private
 */
function _lambdaFunc(func) {
  var vars = annotate(func)
  switch (vars.length) {
    case 0:
      throw new errors.InvalidValue(
        'Provided Function must take at least 1 argument.'
      )
    case 1:
      return _lambdaExpr(vars[0], func(Var(vars[0])))
    default:
      return _lambdaExpr(
        vars,
        func.apply(
          null,
          vars.map(function(name) {
            return Var(name)
          })
        )
      )
  }
}

/**
 * @private
 */
function _lambdaExpr(var_name, expr) {
  return new Expr({ lambda: wrap(var_name), expr: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#basic-forms).
 *
 * Invokes a given function passing in the provided arguments
 *
 * ```
 * Call(Ref("functions/a_function"), 1, 2)
 * ```
 *
 * @param {module:query~ExprArg} ref
 *   The ref of the UserDefinedFunction to call
 * @param {...module:query~ExprArg} args
 *   A series of values to pass as arguments to the UDF.
 * @return {Expr}
 * */
function Call(ref) {
  arity.min(1, arguments, Call.name)
  var args = argsToArray(arguments)
  args.shift()
  return new Expr({ call: wrap(ref), arguments: wrap(varargs(args)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#basic-forms).
 *
 * Constructs a `@query` type using the Lambda() or a function.
 *
 * ```
 * Query(Lambda(['a', 'b'], Add(Var('a'), Var('b'))))
 * Query(function (a, b) { return Add(a, b) })
 * ```
 *
 * @param {module:query~ExprArg|function} lambda
 *   A function to escape as a query.
 * @return {Expr}
 * */
function Query(lambda) {
  arity.exact(1, arguments, Query.name)
  return new Expr({ query: wrap(lambda) })
}

// Collection functions

/** See the [docs](https://app.fauna.com/documentation/reference/queryapi#collections).
 *
 * @param {module:query~ExprArg} collection
 *   An expression resulting in a collection to be mapped over.
 * @param {module:query~ExprArg|function} lambda
 *   A function to be called for each element of the collection.
 * @return {Expr}
 * */
function Map(collection, lambda_expr) {
  arity.exact(2, arguments, Map.name)
  return new Expr({ map: wrap(lambda_expr), collection: wrap(collection) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#collections).
 *
 * @param {module:query~ExprArg} collection
 *   An expression resulting in a collection to be iterated over.
 * @param {module:query~ExprArg|function} lambda
 *   A function to be called for each element of the collection.
 * @return {Expr}
 * */
function Foreach(collection, lambda_expr) {
  arity.exact(2, arguments, Foreach.name)
  return new Expr({ foreach: wrap(lambda_expr), collection: wrap(collection) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#collections).
 *
 * @param {module:query~ExprArg} collection
 *   An expression resulting in a collection to be filtered.
 * @param {module:query~ExprArg|function} lambda
 *   A function that returns a boolean used to filter unwanted values.
 * @return {Expr}
 * */
function Filter(collection, lambda_expr) {
  arity.exact(2, arguments, Filter.name)
  return new Expr({ filter: wrap(lambda_expr), collection: wrap(collection) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#collections).
 *
 * @param {module:query~ExprArg} number
 *   An expression resulting in the number of elements to take from the collection.
 * @param {module:query~ExprArg} collection
 *   An expression resulting in a collection.
 * @return {Expr}
 * */
function Take(number, collection) {
  arity.exact(2, arguments, Take.name)
  return new Expr({ take: wrap(number), collection: wrap(collection) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#collections).
 *
 * @param {module:query~ExprArg} number
 *   An expression resulting in the number of elements to drop from the collection.
 * @param {module:query~ExprArg} collection
 *   An expression resulting in a collection.
 * @return {Expr}
 * */
function Drop(number, collection) {
  arity.exact(2, arguments, Drop.name)
  return new Expr({ drop: wrap(number), collection: wrap(collection) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#collections).
 *
 * @param {module:query~ExprArg} elements
 *   An expression resulting in a collection of elements to prepend to the given collection.
 * @param {module:query~ExprArg} collection
 *   An expression resulting in a collection.
 * @return {Expr}
 */
function Prepend(elements, collection) {
  arity.exact(2, arguments, Prepend.name)
  return new Expr({ prepend: wrap(elements), collection: wrap(collection) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#collections).
 *
 * @param {module:query~ExprArg} elements
 *   An expression resulting in a collection of elements to append to the given collection.
 * @param {module:query~ExprArg} collection
 *   An expression resulting in a collection.
 * @return {Expr}
 */
function Append(elements, collection) {
  arity.exact(2, arguments, Append.name)
  return new Expr({ append: wrap(elements), collection: wrap(collection) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#collections).
 *
 * @param {module:query~ExprArg} collection
 *   An expression resulting in a collection.
 * @return {Expr}
 */
function IsEmpty(collection) {
  arity.exact(1, arguments, IsEmpty.name)
  return new Expr({ is_empty: wrap(collection) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#collections).
 *
 * @param {module:query~ExprArg} collection
 *   An expression resulting in a collection.
 * @return {Expr}
 */
function IsNonEmpty(collection) {
  arity.exact(1, arguments, IsNonEmpty.name)
  return new Expr({ is_nonempty: wrap(collection) })
}

// Type check functions

/**
 * Check if the expression is a number.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isnumber">IsNumber</a>
 */
function IsNumber(expr) {
  arity.exact(1, arguments, IsNumber.name)
  return new Expr({ is_number: wrap(expr) })
}

/**
 * Check if the expression is a double.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isdouble">IsDouble</a>
 */
function IsDouble(expr) {
  arity.exact(1, arguments, IsDouble.name)
  return new Expr({ is_double: wrap(expr) })
}

/**
 * Check if the expression is an integer.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isinteger">IsInteger</a>
 */
function IsInteger(expr) {
  arity.exact(1, arguments, IsInteger.name)
  return new Expr({ is_integer: wrap(expr) })
}

/**
 * Check if the expression is a boolean.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isboolean">IsBoolean</a>
 */
function IsBoolean(expr) {
  arity.exact(1, arguments, IsBoolean.name)
  return new Expr({ is_boolean: wrap(expr) })
}

/**
 * Check if the expression is null.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isnull">IsNull</a>
 */
function IsNull(expr) {
  arity.exact(1, arguments, IsNull.name)
  return new Expr({ is_null: wrap(expr) })
}

/**
 * Check if the expression is a byte array.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isbytes">IsBytes</a>
 */
function IsBytes(expr) {
  arity.exact(1, arguments, IsBytes.name)
  return new Expr({ is_bytes: wrap(expr) })
}

/**
 * Check if the expression is a timestamp.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/istimestamp">IsTimestamp</a>
 */
function IsTimestamp(expr) {
  arity.exact(1, arguments, IsTimestamp.name)
  return new Expr({ is_timestamp: wrap(expr) })
}

/**
 * Check if the expression is a date.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isdate">IsDate</a>
 */
function IsDate(expr) {
  arity.exact(1, arguments, IsDate.name)
  return new Expr({ is_date: wrap(expr) })
}

/**
 * Check if the expression is a string.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isstring">IsString</a>
 */
function IsString(expr) {
  arity.exact(1, arguments, IsString.name)
  return new Expr({ is_string: wrap(expr) })
}

/**
 * Check if the expression is an array.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isarray">IsArray</a>
 */
function IsArray(expr) {
  arity.exact(1, arguments, IsArray.name)
  return new Expr({ is_array: wrap(expr) })
}

/**
 * Check if the expression is an object.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isobject">IsObject</a>
 */
function IsObject(expr) {
  arity.exact(1, arguments, IsObject.name)
  return new Expr({ is_object: wrap(expr) })
}

/**
 * Check if the expression is a reference.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isref">IsRef</a>
 */
function IsRef(expr) {
  arity.exact(1, arguments, IsRef.name)
  return new Expr({ is_ref: wrap(expr) })
}

/**
 * Check if the expression is a set.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isset">IsSet</a>
 */
function IsSet(expr) {
  arity.exact(1, arguments, IsSet.name)
  return new Expr({ is_set: wrap(expr) })
}

/**
 * Check if the expression is a document (either a reference or an instance).
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isdoc">IsDoc</a>
 */
function IsDoc(expr) {
  arity.exact(1, arguments, IsDoc.name)
  return new Expr({ is_doc: wrap(expr) })
}

/**
 * Check if the expression is a lambda.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/islambda">IsLambda</a>
 */
function IsLambda(expr) {
  arity.exact(1, arguments, IsLambda.name)
  return new Expr({ is_lambda: wrap(expr) })
}

/**
 * Check if the expression is a collection.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/iscollection">IsCollection</a>
 */
function IsCollection(expr) {
  arity.exact(1, arguments, IsCollection.name)
  return new Expr({ is_collection: wrap(expr) })
}

/**
 * Check if the expression is a database.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isdatabase">IsDatabase</a>
 */
function IsDatabase(expr) {
  arity.exact(1, arguments, IsDatabase.name)
  return new Expr({ is_database: wrap(expr) })
}

/**
 * Check if the expression is an index.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isindex">IsIndex</a>
 */
function IsIndex(expr) {
  arity.exact(1, arguments, IsIndex.name)
  return new Expr({ is_index: wrap(expr) })
}

/**
 * Check if the expression is a function.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isfunction">IsFunction</a>
 */
function IsFunction(expr) {
  arity.exact(1, arguments, IsFunction.name)
  return new Expr({ is_function: wrap(expr) })
}

/**
 * Check if the expression is a key.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/iskey">IsKey</a>
 */
function IsKey(expr) {
  arity.exact(1, arguments, IsKey.name)
  return new Expr({ is_key: wrap(expr) })
}

/**
 * Check if the expression is a token.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/istoken">IsToken</a>
 */
function IsToken(expr) {
  arity.exact(1, arguments, IsToken.name)
  return new Expr({ is_token: wrap(expr) })
}

/**
 * Check if the expression is credentials.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/iscredentials">IsCredentials</a>
 */
function IsCredentials(expr) {
  arity.exact(1, arguments, IsCredentials.name)
  return new Expr({ is_credentials: wrap(expr) })
}

/**
 * Check if the expression is a role.
 *
 * @param {module:query~ExprArg} expr
 *   The expression to check
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/isrole">IsRole</a>
 */
function IsRole(expr) {
  arity.exact(1, arguments, IsRole.name)
  return new Expr({ is_role: wrap(expr) })
}

// Read functions

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#read-functions).
 *
 * @param {module:query~ExprArg} ref
 *   An expression resulting in either a Ref or SetRef.
 * @param {?module:query~ExprArg} ts
 *   The snapshot time at which to get the document.
 * @return {Expr}
 */
function Get(ref, ts) {
  arity.between(1, 2, arguments, Get.name)
  ts = defaults(ts, null)

  return new Expr(params({ get: wrap(ref) }, { ts: wrap(ts) }))
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#read-functions).
 *
 * @param {module:query~ExprArg} secret
 *   The key or token secret to lookup.
 * @return {Expr}
 */
function KeyFromSecret(secret) {
  arity.exact(1, arguments, KeyFromSecret.name)
  return new Expr({ key_from_secret: wrap(secret) })
}

/**
 * See the [docs](https://docs.fauna.com/fauna/current/api/fql/functions/reduce).
 *
 * @param {module:query~ExprArg} lambda
 *   The accumulator function
 * @param {module:query~ExprArg} initial
 *   The initial value
 * @param {module:query~ExprArg} collection
 *   The colleciton to be reduced
 * @return {Expr}
 */
function Reduce(lambda, initial, collection) {
  arity.exact(3, arguments, Reduce.name)
  return new Expr({
    reduce: wrap(lambda),
    initial: wrap(initial),
    collection: wrap(collection),
  })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#read-functions).
 * You may want to utilize {@link Client#paginate} to obtain a {@link PageHelper},
 * rather than using this query function directly.
 *
 * @param {module:query~ExprArg} set
 *   An expression resulting in a SetRef to page over.
 * @param {?Object} opts
 *  An object representing options for pagination.
 *    - size: Maximum number of results to return.
 *    - after: Return the next page of results after this cursor (inclusive).
 *    - before: Return the previous page of results before this cursor (exclusive).
 *    - sources: If true, include the source sets along with each element.
 * @return {Expr}
 */
function Paginate(set, opts) {
  arity.between(1, 2, arguments, Paginate.name)
  opts = defaults(opts, {})

  return new Expr(objectAssign({ paginate: wrap(set) }, wrapValues(opts)))
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#read-functions).
 *
 * @param {module:query~ExprArg} ref
 *   An expression resulting in a Ref.
 * @param {?module:query~ExprArg} ts
 *   The snapshot time at which to check for the document's existence.
 * @return {Expr}
 */
function Exists(ref, ts) {
  arity.between(1, 2, arguments, Exists.name)
  ts = defaults(ts, null)

  return new Expr(params({ exists: wrap(ref) }, { ts: wrap(ts) }))
}

// Write functions

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#write-functions).
 *
 * @param {module:query~ExprArg} ref
 *   The Ref (usually a CollectionRef) to create.
 * @param {?module:query~ExprArg} params
 *   An object representing the parameters of the document.
 * @return {Expr}
 */
function Create(collection_ref, params) {
  arity.between(1, 2, arguments, Create.name)
  return new Expr({ create: wrap(collection_ref), params: wrap(params) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#write-functions).
 *
 * @param {module:query~ExprArg} ref
 *   The Ref to update.
 * @param {module:query~ExprArg} params
 *   An object representing the parameters of the document.
 * @return {Expr}
 */
function Update(ref, params) {
  arity.exact(2, arguments, Update.name)
  return new Expr({ update: wrap(ref), params: wrap(params) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#write-functions).
 *
 * @param {module:query~ExprArg} ref
 *   The Ref to replace.
 * @param {module:query~ExprArg} params
 *   An object representing the parameters of the document.
 * @return {Expr}
 */
function Replace(ref, params) {
  arity.exact(2, arguments, Replace.name)
  return new Expr({ replace: wrap(ref), params: wrap(params) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#write-functions).
 *
 * @param {module:query~ExprArg} ref
 *   The Ref to delete.
 * @return {Expr}
 */
function Delete(ref) {
  arity.exact(1, arguments, Delete.name)
  return new Expr({ delete: wrap(ref) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#write-functions).
 *
 * @param {module:query~ExprArg} ref
 *   The Ref to insert against
 * @param {module:query~ExprArg} ts
 *   The valid time of the inserted event
 * @param {module:query~ExprArg} action
 *   Whether the event should be a Create, Update, or Delete.
 * @param {module:query~ExprArg} params
 *   If this is a Create or Update, the parameters of the document.
 * @return {Expr}
 */
function Insert(ref, ts, action, params) {
  arity.exact(4, arguments, Insert.name)
  return new Expr({
    insert: wrap(ref),
    ts: wrap(ts),
    action: wrap(action),
    params: wrap(params),
  })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#write-functions).
 *
 * @param {module:query~ExprArg} ref
 *   The Ref of the document whose event should be removed.
 * @param {module:query~ExprArg} ts
 *   The valid time of the event.
 * @param {module:query~ExprArg} action
 *   The event action (Create, Update, or Delete) that should be removed.
 * @return {Expr}
 */
function Remove(ref, ts, action) {
  arity.exact(3, arguments, Remove.name)
  return new Expr({ remove: wrap(ref), ts: wrap(ts), action: wrap(action) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#write-functions).
 *
 * @param {module:query~ExprArg} params
 *   An object of parameters used to create a class.
 *     - name (required): the name of the class to create
 * @return {Expr}
 *
 * @deprecated use CreateCollection instead
 */
function CreateClass(params) {
  arity.exact(1, arguments, CreateClass.name)
  return new Expr({ create_class: wrap(params) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#write-functions).
 *
 * @param {module:query~ExprArg} params
 *   An object of parameters used to create a collection.
 *     - name (required): the name of the collection to create
 * @return {Expr}
 */
function CreateCollection(params) {
  arity.exact(1, arguments, CreateCollection.name)
  return new Expr({ create_collection: wrap(params) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#write-functions).
 *
 * @param {module:query~ExprArg} params
 *   An object of parameters used to create a database.
 *     - name (required): the name of the database to create
 * @return {Expr}
 */
function CreateDatabase(params) {
  arity.exact(1, arguments, CreateDatabase.name)
  return new Expr({ create_database: wrap(params) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#write-functions).
 *
 * @param {module:query~ExprArg} params
 *   An object of parameters used to create an index.
 *     - name (required): the name of the index to create
 *     - source: One or more source objects describing source collections and (optional) field bindings.
 *     - terms: An array of term objects describing the fields to be indexed. Optional
 *     - values: An array of value objects describing the fields to be covered. Optional
 *     - unique: If true, maintains a uniqueness constraint on combined terms and values. Optional
 *     - partitions: The number of sub-partitions within each term. Optional
 * @return {Expr}
 */
function CreateIndex(params) {
  arity.exact(1, arguments, CreateIndex.name)
  return new Expr({ create_index: wrap(params) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#write-functions).
 *
 * @param {module:query~ExprArg} params
 *   An object of parameters used to create a new key
 *     - database: Ref of the database the key will be scoped to. Optional.
 *     - role: The role of the new key
 * @return {Expr}
 */
function CreateKey(params) {
  arity.exact(1, arguments, CreateKey.name)
  return new Expr({ create_key: wrap(params) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#write-functions).
 *
 * @param {module:query~ExprArg} params
 *   An object of parameters used to create a new user defined function.
 *     - name: The name of the function
 *     - body: A lambda function (escaped with `query`).
 * @return {Expr}
 */
function CreateFunction(params) {
  arity.exact(1, arguments, CreateFunction.name)
  return new Expr({ create_function: wrap(params) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#write-functions).
 *
 * @param {module:query~ExprArg} params
 *   An object of parameters used to create a new role.
 *     - name: The name of the role
 *     - privileges: An array of privileges
 *     - membership: An array of membership bindings
 * @return {Expr}
 */
function CreateRole(params) {
  arity.exact(1, arguments, CreateRole.name)
  return new Expr({ create_role: wrap(params) })
}

// Sets

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#sets).
 *
 * @param {module:query~ExprArg} ref
 *   The Ref of the document for which to retrieve the singleton set.
 * @return {Expr}
 */
function Singleton(ref) {
  arity.exact(1, arguments, Singleton.name)
  return new Expr({ singleton: wrap(ref) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#sets).
 *
 * @param {module:query~ExprArg} ref
 *   A Ref or SetRef to retrieve an event set from.
 * @return {Expr}
 */
function Events(ref_set) {
  arity.exact(1, arguments, Events.name)
  return new Expr({ events: wrap(ref_set) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#sets).
 *
 * @param {module:query~ExprArg} index
 *   The Ref of the index to match against.
 * @param {...module:query~ExprArg} terms
 *   A list of terms used in the match.
 * @return {Expr}
 */
function Match(index) {
  arity.min(1, arguments, Match.name)
  var args = argsToArray(arguments)
  args.shift()
  return new Expr({ match: wrap(index), terms: wrap(varargs(args)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#sets).
 *
 * @param {...module:query~ExprArg} sets
 *   A list of SetRefs to union together.
 * @return {Expr}
 */
function Union() {
  arity.min(1, arguments, Union.name)
  return new Expr({ union: wrap(varargs(arguments)) })
}

/**
 * Merge two or more objects..
 *
 * @param {...module:query~ExprArg} merge merge the first object.
 * @param {...module:query~ExprArg} _with the second object or a list of objects
 * @param {...module:query~ExprArg} lambda a lambda to resolve possible conflicts
 * @return {Expr}
 * */
function Merge(merge, _with, lambda) {
  arity.between(2, 3, arguments, Merge.name)
  return new Expr(
    params({ merge: wrap(merge), with: wrap(_with) }, { lambda: wrap(lambda) })
  )
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#sets).
 *
 * @param {...module:query~ExprArg} sets
 *   A list of SetRefs to intersect.
 * @return {Expr}
 * */
function Intersection() {
  arity.min(1, arguments, Intersection.name)
  return new Expr({ intersection: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#sets).
 *
 * @param {...module:query~ExprArg} sets
 *   A list of SetRefs to diff.
 * @return {Expr}
 * */
function Difference() {
  arity.min(1, arguments, Difference.name)
  return new Expr({ difference: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#sets).
 *
 * @param {module:query~ExprArg} set
 *   A SetRef to remove duplicates from.
 * @return {Expr}
 * */
function Distinct(set) {
  arity.exact(1, arguments, Distinct.name)
  return new Expr({ distinct: wrap(set) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#sets).
 *
 * @param {module:query~ExprArg} source
 *   A SetRef of the source set
 * @param {module:query~ExprArg|function} target
 *   A Lambda that will accept each element of the source Set and return a Set
 * @return {Expr}
 */
function Join(source, target) {
  arity.exact(2, arguments, Join.name)
  return new Expr({ join: wrap(source), with: wrap(target) })
}

/**
 * See the [docs](https://docs.fauna.com/fauna/current/api/fql/functions/range).
 *
 * @param {module:query~ExprArg} set
 *   A SetRef of the source set
 * @param {module:query~ExprArg} from
 *   The lower bound
 * @param {module:query~ExprArg} to
 *   The upper bound
 * @return {Expr}
 */
function Range(set, from, to) {
  arity.exact(3, arguments, Range.name)
  return new Expr({ range: wrap(set), from: wrap(from), to: wrap(to) })
}

// Authentication

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#authentication).
 *
 * @param {module:query~ExprArg} ref
 *   A Ref with credentials to authenticate against
 * @param {module:query~ExprArg} params
 *   An object of parameters to pass to the login function
 *     - password: The password used to login
 * @return {Expr}
 * */
function Login(ref, params) {
  arity.exact(2, arguments, Login.name)
  return new Expr({ login: wrap(ref), params: wrap(params) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#authentication).
 *
 * @param {module:query~ExprArg} delete_tokens
 *   If true, log out all tokens associated with the current session.
 * @return {Expr}
 */
function Logout(delete_tokens) {
  arity.exact(1, arguments, Logout.name)
  return new Expr({ logout: wrap(delete_tokens) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#authentication).
 *
 * @param {module:query~ExprArg} ref
 *   The Ref to check the password against.
 * @param {module:query~ExprArg} password
 *   The credentials password to check.
 * @return {Expr}
 */
function Identify(ref, password) {
  arity.exact(2, arguments, Identify.name)
  return new Expr({ identify: wrap(ref), password: wrap(password) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#authentication).
 *
 * @return {Expr}
 */
function Identity() {
  arity.exact(0, arguments, Identity.name)
  return new Expr({ identity: null })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#authentication).
 *
 * @return {Expr}
 */
function HasIdentity() {
  arity.exact(0, arguments, HasIdentity.name)
  return new Expr({ has_identity: null })
}

// String functions

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} strings - A list of strings to concatenate.
 * @param {string} separator  - The separator to use between each string.
 * @return {string} a single combined string
 */
function Concat(strings, separator) {
  arity.min(1, arguments, Concat.name)
  separator = defaults(separator, null)
  return new Expr(
    params({ concat: wrap(strings) }, { separator: wrap(separator) })
  )
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} string - The string to casefold.
 * @param {string} normalizer - The algorithm to use. One of: NFKCCaseFold, NFC, NFD, NFKC, NFKD.
 * @return {string} a normalized string
 */
function Casefold(string, normalizer) {
  arity.min(1, arguments, Casefold.name)
  return new Expr(
    params({ casefold: wrap(string) }, { normalizer: wrap(normalizer) })
  )
}

/**
 * Returns true if the string contains the given substring, or false if otherwise
 *
 * @param {string} value  - the string to evaluate
 * @param {string} search - the substring to search for
 * @return {boolean}      - was the search result found
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/containsstr">FaunaDB ContainsStr Function</a>
 */
function ContainsStr(value, search) {
  arity.exact(2, arguments, ContainsStr.name)
  return new Expr({ containsstr: wrap(value), search: wrap(search) })
}

/**
 * Returns true if the string contains the given pattern, or false if otherwise
 *
 * @param {string} value   - the string to evaluate
 * @param {string} pattern - the pattern to search for
 * @return {boolean}       - was the regex search result found
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/containsstrregex">FaunaDB ContainsStrRegex Function</a>
 */
function ContainsStrRegex(value, pattern) {
  arity.exact(2, arguments, ContainsStrRegex.name)
  return new Expr({ containsstrregex: wrap(value), pattern: wrap(pattern) })
}

/**
 * Returns true if the string starts with the given prefix value, or false if otherwise
 *
 * @param {string} value   - the string to evaluate
 * @param {string} search  - the prefix to search for
 * @return {boolean}       - does `value` start with `search`
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/startswith">FaunaDB StartsWith Function</a>
 */
function StartsWith(value, search) {
  arity.exact(2, arguments, StartsWith.name)
  return new Expr({ startswith: wrap(value), search: wrap(search) })
}

/**
 * Returns true if the string ends with the given suffix value, or false if otherwise
 *
 * @param {string} value   - the string to evaluate
 * @param {string} search  - the suffix to search for
 * @return {boolean}       - does `value` end with `search`
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/endswith">FaunaDB EndsWith Function</a>
 */
function EndsWith(value, search) {
  arity.exact(2, arguments, EndsWith.name)
  return new Expr({ endswith: wrap(value), search: wrap(search) })
}

/**
 * It takes a string and returns a regex which matches the input string verbatim.
 *
 * @param value      - the string to analyze
 * @return {string}  - a regex which matches the input string verbatim
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/regexescape">FaunaDB RegexEscape Function</a>
 */
function RegexEscape(value) {
  arity.exact(1, arguments, RegexEscape.name)
  return new Expr({ regexescape: wrap(value) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} value - A string to search.
 * @param {string} find - Find the first position of this string in the search string
 * @param {int} start - An optional start offset into the search string
 * @return {int} location of the found string or -1 if not found
 */
function FindStr(value, find, start) {
  arity.between(2, 3, arguments, FindStr.name)
  start = defaults(start, null)
  return new Expr(
    params({ findstr: wrap(value), find: wrap(find) }, { start: wrap(start) })
  )
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} value - A string to search.
 * @param {string} pattern - Find the first position of this pattern in the search string using a java regular expression syntax
 * @param {int} start - An optional start offset into the search string
 * @param {int} numResults - An optional number of results to return, max 1024
 * @return {Array} an array of object describing where the search pattern was located
 */
function FindStrRegex(value, pattern, start, numResults) {
  arity.between(2, 4, arguments, FindStrRegex.name)
  start = defaults(start, null)
  return new Expr(
    params(
      { findstrregex: wrap(value), pattern: wrap(pattern) },
      { start: wrap(start), num_results: wrap(numResults) }
    )
  )
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} value - The string to calculate the length in codepoints.
 * @return {int} the length of the string in codepoints
 */
function Length(value) {
  arity.exact(1, arguments, Length.name)
  return new Expr({ length: wrap(value) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} value - The string to LowerCase.
 * @return {string} the string converted to lowercase
 */
function LowerCase(value) {
  arity.exact(1, arguments, LowerCase.name)
  return new Expr({ lowercase: wrap(value) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} value - The string to trim leading white space.
 * @return {string} the string with leading white space removed
 */
function LTrim(value) {
  arity.exact(1, arguments, LTrim.name)
  return new Expr({ ltrim: wrap(value) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {module:query~ExprArg} terms
 *   A document from which to produce ngrams.
 * @param {?Object} opts
 *   An object of options
 *     - min: The minimum ngram size.
 *     - max: The maximum ngram size.
 * @return {Array|Value}
 */
function NGram(terms, min, max) {
  arity.between(1, 3, arguments, NGram.name)
  min = defaults(min, null)
  max = defaults(max, null)

  return new Expr(
    params({ ngram: wrap(terms) }, { min: wrap(min), max: wrap(max) })
  )
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} value - A string to repeat.
 * @param {int} number - The number of times to repeat the string
 * @return {string} a string which was repeated
 */
function Repeat(value, number) {
  arity.between(1, 2, arguments, Repeat.name)
  number = defaults(number, null)
  return new Expr(params({ repeat: wrap(value) }, { number: wrap(number) }))
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} value - A string to search.
 * @param {string} find - The string to find in the search string
 * @param {string} replace - The string to replace in the search string
 * @return {String} all the occurrences of find substituted with replace string
 */
function ReplaceStr(value, find, replace) {
  arity.exact(3, arguments, ReplaceStr.name)
  return new Expr({
    replacestr: wrap(value),
    find: wrap(find),
    replace: wrap(replace),
  })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} value - A string to search.
 * @param {string} pattern - The pattern to find in the search string using a java regular expression syntax
 * @param {string} replace - The string to replace in the search string
 * @param {boolean} first - Replace all or just the first
 * @return {string} all the occurrences of find pattern substituted with replace string
 */
function ReplaceStrRegex(value, pattern, replace, first) {
  arity.between(3, 4, arguments, ReplaceStrRegex.name)
  first = defaults(first, null)
  return new Expr(
    params(
      {
        replacestrregex: wrap(value),
        pattern: wrap(pattern),
        replace: wrap(replace),
      },
      { first: wrap(first) }
    )
  )
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} value - The string to remove white space from the end.
 * @return {string} the string with trailing whitespaces removed
 */
function RTrim(value) {
  arity.exact(1, arguments, RTrim.name)
  return new Expr({ rtrim: wrap(value) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {int} num - The string of N Space(s).
 * @return {string} a string with spaces
 */
function Space(num) {
  arity.exact(1, arguments, Space.name)
  return new Expr({ space: wrap(num) })
}
/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} value  The string to SubString.
 * @param {int} start  The position the first character of the return string begins at
 * @param {int} length  An optional length, if omitted then returns to the end of string
 * @return {string}
 */
function SubString(value, start, length) {
  arity.between(1, 3, arguments, SubString.name)
  start = defaults(start, null)
  length = defaults(length, null)
  return new Expr(
    params(
      { substring: wrap(value) },
      { start: wrap(start), length: wrap(length) }
    )
  )
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} value - The string to TitleCase.
 * @return {string}  A string converted to titlecase
 */
function TitleCase(value) {
  arity.exact(1, arguments, TitleCase.name)
  return new Expr({ titlecase: wrap(value) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} value - The string to Trim.
 * @return {string} a string with leading and trailing whitespace removed
 */
function Trim(value) {
  arity.exact(1, arguments, Trim.name)
  return new Expr({ trim: wrap(value) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#string-functions).
 *
 * @param {string} value - The string to Uppercase.
 * @return {string} An uppercase string
 */
function UpperCase(value) {
  arity.exact(1, arguments, UpperCase.name)
  return new Expr({ uppercase: wrap(value) })
}

/**
 * Format values into a string.
 *
 * @param  {string}  string string with format specifiers
 * @param  {array}   values list of values to format
 * @return {string}         a string
 */
function Format(string) {
  arity.min(1, arguments, Format.name)
  var args = argsToArray(arguments)
  args.shift()
  return new Expr({ format: wrap(string), values: wrap(varargs(args)) })
}

// Time and date functions
/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#time-and-date).
 *
 * @param {module:query~ExprArg} string
 *   A string to converted to a time object.
 * @return {Expr}
 */
function Time(string) {
  arity.exact(1, arguments, Time.name)
  return new Expr({ time: wrap(string) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#time-and-date).
 *
 * @param {module:query~ExprArg} number
 *   The number of `unit`s from Epoch
 * @param {module:query~ExprArg} unit
 *   The unit of `number`. One of second, millisecond, microsecond, nanosecond.
 * @return {Expr}
 */
function Epoch(number, unit) {
  arity.exact(2, arguments, Epoch.name)
  return new Expr({ epoch: wrap(number), unit: wrap(unit) })
}

/**
 * See the [docs](https://docs.fauna.com/fauna/current/api/fql/functions/timeadd).
 *
 * Returns a new time or date with the offset in terms of the unit
 * added.
 *
 * @param base the base time or data
 * @param offset the number of units
 * @param unit the unit type
 * @return {Expr}
 */
function TimeAdd(base, offset, unit) {
  arity.exact(3, arguments, TimeAdd.name)
  return new Expr({
    time_add: wrap(base),
    offset: wrap(offset),
    unit: wrap(unit),
  })
}

/**
 * See the [docs](https://docs.fauna.com/fauna/current/api/fql/functions/timesubtract).
 *
 * Returns a new time or date with the offset in terms of the unit
 * subtracted.
 *
 * @param base the base time or data
 * @param offset the number of units
 * @param unit the unit type
 * @return {Expr}
 */
function TimeSubtract(base, offset, unit) {
  arity.exact(3, arguments, TimeSubtract.name)
  return new Expr({
    time_subtract: wrap(base),
    offset: wrap(offset),
    unit: wrap(unit),
  })
}

/**
 * See the [docs](https://docs.fauna.com/fauna/current/api/fql/functions/timediff).
 *
 * Returns the number of intervals in terms of the unit between
 * two times or dates. Both start and finish must be of the same
 * type.
 *
 * @param start the starting time or date, inclusive
 * @param finish the ending time or date, exclusive
 * @param unit the unit type
 * @return {Expr}
 */
function TimeDiff(start, finish, unit) {
  arity.exact(3, arguments, TimeDiff.name)
  return new Expr({
    time_diff: wrap(start),
    other: wrap(finish),
    unit: wrap(unit),
  })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#time-and-date).
 *
 * @param {module:query~ExprArg} string
 *   A string to convert to a Date object
 * @return {Expr}
 */
function Date(string) {
  arity.exact(1, arguments, Date.name)
  return new Expr({ date: wrap(string) })
}

/**
 * Returns the current snapshot time.
 *
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/now">Now function</a>
 */
function Now() {
  arity.exact(0, arguments, Now.name)
  return new Expr({ now: wrap(null) })
}

// Miscellaneous functions

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * @deprecated use NewId instead
 * @return {Expr}
 */
function NextId() {
  arity.exact(0, arguments, NextId.name)
  return new Expr({ next_id: null })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * @return {Expr}
 */
function NewId() {
  arity.exact(0, arguments, NewId.name)
  return new Expr({ new_id: null })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * @param {module:query~ExprArg} name
 *   The name of the database.
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the database's scope.
 * @return {Expr}
 */
function Database(name, scope) {
  arity.between(1, 2, arguments, Database.name)
  switch (arguments.length) {
    case 1:
      return new Expr({ database: wrap(name) })
    case 2:
      return new Expr({ database: wrap(name), scope: wrap(scope) })
  }
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * @param {module:query~ExprArg} name
 *   The name of the index.
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the index's scope.
 * @return {Expr}
 */
function Index(name, scope) {
  arity.between(1, 2, arguments, Index.name)
  switch (arguments.length) {
    case 1:
      return new Expr({ index: wrap(name) })
    case 2:
      return new Expr({ index: wrap(name), scope: wrap(scope) })
  }
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * @param {module:query~ExprArg} name
 *   The name of the class.
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the class's scope.
 * @return {Expr}
 *
 * @deprecated Class is deprecated, use Collection instead
 */
function Class(name, scope) {
  arity.between(1, 2, arguments, Class.name)
  switch (arguments.length) {
    case 1:
      return new Expr({ class: wrap(name) })
    case 2:
      return new Expr({ class: wrap(name), scope: wrap(scope) })
  }
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * @param {module:query~ExprArg} name
 *   The name of the collection.
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the collection's scope.
 * @return {Expr}
 */
function Collection(name, scope) {
  arity.between(1, 2, arguments, Collection.name)
  switch (arguments.length) {
    case 1:
      return new Expr({ collection: wrap(name) })
    case 2:
      return new Expr({ collection: wrap(name), scope: wrap(scope) })
  }
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * @param {module:query~ExprArg} name
 *   The name of the user defined function.
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the user defined function's scope.
 * @return {Expr}
 */
function FunctionFn(name, scope) {
  arity.between(1, 2, arguments, FunctionFn.name)
  switch (arguments.length) {
    case 1:
      return new Expr({ function: wrap(name) })
    case 2:
      return new Expr({ function: wrap(name), scope: wrap(scope) })
  }
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * @param {module:query~ExprArg} name
 *   The name of the role.
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the role's scope.
 * @return {Expr}
 */
function Role(name, scope) {
  arity.between(1, 2, arguments, Role.name)
  scope = defaults(scope, null)
  return new Expr(params({ role: wrap(name) }, { scope: wrap(scope) }))
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * Constructs a `classes` function that, when evaluated, returns a Ref value.
 *
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the class set's scope.
 * @return {Expr}
 */
function Classes(scope) {
  arity.max(1, arguments, Classes.name)
  scope = defaults(scope, null)
  return new Expr({ classes: wrap(scope) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * Constructs a `collections` function that, when evaluated, returns a Ref value.
 *
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the collection set's scope.
 * @return {Expr}
 */
function Collections(scope) {
  arity.max(1, arguments, Collections.name)
  scope = defaults(scope, null)
  return new Expr({ collections: wrap(scope) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * Constructs a `databases` functions that, when evaluated, returns a Ref value.
 *
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the database set's scope.
 * @return {Expr}
 */
function Databases(scope) {
  arity.max(1, arguments, Databases.name)
  scope = defaults(scope, null)
  return new Expr({ databases: wrap(scope) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * Constructs an `indexes` function that, when evaluated, returns a Ref value.
 *
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the index set's scope.
 * @return {Expr}
 */
function Indexes(scope) {
  arity.max(1, arguments, Indexes.name)
  scope = defaults(scope, null)
  return new Expr({ indexes: wrap(scope) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * Constructs a `functions` function that, when evaluated, returns a Ref value.
 *
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the user defined function set's scope.
 * @return {Expr}
 */
function Functions(scope) {
  arity.max(1, arguments, Functions.name)
  scope = defaults(scope, null)
  return new Expr({ functions: wrap(scope) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * Constructs a `roles` function that, when evaluated, returns a Ref value.
 *
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the role set's scope.
 * @return {Expr}
 */
function Roles(scope) {
  arity.max(1, arguments, Roles.name)
  scope = defaults(scope, null)
  return new Expr({ roles: wrap(scope) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * Constructs a `keys` function that, when evaluated, returns a Ref value.
 *
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the key set's scope.
 * @return {Expr}
 */
function Keys(scope) {
  arity.max(1, arguments, Keys.name)
  scope = defaults(scope, null)
  return new Expr({ keys: wrap(scope) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * Constructs a `tokens` function that, when evaluated, returns a Ref value.
 *
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the token set's scope.
 * @return {Expr}
 */
function Tokens(scope) {
  arity.max(1, arguments, Tokens.name)
  scope = defaults(scope, null)
  return new Expr({ tokens: wrap(scope) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * Constructs a `credentials` functions that, when evaluated, returns a Ref value.
 *
 * @param {module:query~ExprArg} [scope]
 *   The Ref of the credential set's scope.
 * @return {Expr}
 */
function Credentials(scope) {
  arity.max(1, arguments, Credentials.name)
  scope = defaults(scope, null)
  return new Expr({ credentials: wrap(scope) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of expressions to check for equivalence.
 * @return {Expr}
 */
function Equals() {
  arity.min(1, arguments, Equals.name)
  return new Expr({ equals: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * @param {module:query~ExprArg} path
 *   An array representing a path to check for the existence of.
 * @param {module:query~ExprArg} in
 *   An object to search against.
 * @return {Expr}
 */
function Contains(path, _in) {
  arity.exact(2, arguments, Contains.name)
  return new Expr({ contains: wrap(path), in: wrap(_in) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * @param {module:query~ExprArg} path
 *   An array representing a path to pull from an object.
 * @param {module:query~ExprArg} from
 *   The object to select from
 * @param {?module:query~ExprArg} default
 *   A default value if the path does not exist.
 * @return {Expr}
 */
function Select(path, from, _default) {
  arity.between(2, 3, arguments, Select.name)
  var exprObj = { select: wrap(path), from: wrap(from) }
  if (_default !== undefined) {
    exprObj.default = wrap(_default)
  }
  return new Expr(exprObj)
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#miscellaneous-functions).
 *
 * @param {module:query~ExprArg} path
 *   An array representing a path to pull from an object.
 * @param {module:query~ExprArg} from
 *   The object to select from
 * @return {Expr}
 *
 * @deprecated avoid using
 */
function SelectAll(path, from) {
  arity.exact(2, arguments, SelectAll.name)
  return new Expr({ select_all: wrap(path), from: wrap(from) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A numbers to provide the absolute value.
 * @return {Expr}
 */
function Abs(expr) {
  arity.exact(1, arguments, Abs.name)
  return new Expr({ abs: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of numbers to sum together.
 * @return {Expr}
 */
function Add() {
  arity.min(1, arguments, Add.name)
  return new Expr({ add: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of numbers to bitwise and together.
 * @return {Expr}
 */
function BitAnd() {
  arity.min(1, arguments, BitAnd.name)
  return new Expr({ bitand: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A numbers to provide the bitwise not.
 * @return {Expr}
 */
function BitNot(expr) {
  arity.exact(1, arguments, BitNot.name)
  return new Expr({ bitnot: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of numbers to bitwise Or'd together.
 * @return {Expr}
 */
function BitOr() {
  arity.min(1, arguments, BitOr.name)
  return new Expr({ bitor: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of numbers to bitwise Xor'd together.
 * @return {Expr}
 */
function BitXor() {
  arity.min(1, arguments, BitXor.name)
  return new Expr({ bitxor: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The least integer that is greater than or equal to the number
 * @return {Expr}
 */
function Ceil(expr) {
  arity.exact(1, arguments, Ceil.name)
  return new Expr({ ceil: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of numbers to compute the quotient of.
 * @return {Expr}
 */
function Divide() {
  arity.min(1, arguments, Divide.name)
  return new Expr({ divide: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The greatest integer that is less than or equal to the number
 * @return {Expr}
 */
function Floor(expr) {
  arity.exact(1, arguments, Floor.name)
  return new Expr({ floor: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of numbers to multiply together.
 * @return {Expr}
 */
function Max() {
  arity.min(1, arguments, Max.name)
  return new Expr({ max: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of numbers to multiply together.
 * @return {Expr}
 */
function Min() {
  arity.min(1, arguments, Min.name)
  return new Expr({ min: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of numbers to compute the quotient of. The remainder will be returned.
 * @return {Expr}
 */
function Modulo() {
  arity.min(1, arguments, Modulo.name)
  return new Expr({ modulo: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of numbers to multiply together.
 * @return {Expr}
 */
function Multiply() {
  arity.min(1, arguments, Multiply.name)
  return new Expr({ multiply: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A numbers to round.
 * @param {...module:query~ExprArg} terms
 *   An optional precision
 * @return {Expr}
 */
function Round(value, precision) {
  arity.min(1, arguments, Round.name)
  precision = defaults(precision, null)
  return new Expr(
    params({ round: wrap(value) }, { precision: wrap(precision) })
  )
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of numbers to compute the difference of.
 * @return {Expr}
 */
function Subtract() {
  arity.min(1, arguments, Subtract.name)
  return new Expr({ subtract: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The sign of the number is returned as positive 1, zero 0 , negative -1
 * @return {Expr}
 */
function Sign(expr) {
  arity.exact(1, arguments, Sign.name)
  return new Expr({ sign: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The square root of the number
 * @return {Expr}
 */
function Sqrt(expr) {
  arity.exact(1, arguments, Sqrt.name)
  return new Expr({ sqrt: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A numbers to truncate.
 * @param {...module:query~ExprArg} terms
 *   An optional precision
 * @return {Expr}
 */
function Trunc(value, precision) {
  arity.min(1, arguments, Trunc.name)
  precision = defaults(precision, null)
  return new Expr(
    params({ trunc: wrap(value) }, { precision: wrap(precision) })
  )
}

/**
 *
 * Count the number of elements in the collection.
 *
 * @param {array}    - array of items
 * @return {integer} - number of items in the collection
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/count">Count function</a>
 */
function Count(collection) {
  arity.exact(1, arguments, Count.name)
  return new Expr({ count: wrap(collection) })
}

/**
 *
 * Sum the elements in the collection.
 *
 * @param {array} - collection of numbers
 * @return {integer} - total of all numbers in collection
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/sum">Sum function</a>
 */
function Sum(collection) {
  arity.exact(1, arguments, Sum.name)
  return new Expr({ sum: wrap(collection) })
}

/**
 *
 * Returns the mean of all elements in the collection.
 *
 * @param {array} - collection the numbers
 * @return {float} - the mean of all numbers in the collection
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/mean">Mean function</a>
 */
function Mean(collection) {
  arity.exact(1, arguments, Mean.name)
  return new Expr({ mean: wrap(collection) })
}

/**
 *
 * Evaluates to true if any element of the collection is true.
 *
 * @param {array} - collection the collection
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/any">Any function</a>
 */
function Any(collection) {
  arity.exact(1, arguments, Any.name)
  return new Expr({ any: wrap(collection) })
}

/**
 *
 * Evaluates to true if all elements of the collection are true.
 *
 * @param {array} - collection the collection
 * @return {Expr}
 * @see <a href="https://docs.fauna.com/fauna/current/api/fql/functions/all">All function</a>
 */
function All(collection) {
  arity.exact(1, arguments, All.name)
  return new Expr({ all: wrap(collection) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The arc cosine of the number
 * @return {Expr}
 */
function Acos(expr) {
  arity.exact(1, arguments, Acos.name)
  return new Expr({ acos: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The arc sine of the number
 * @return {Expr}
 */
function Asin(expr) {
  arity.exact(1, arguments, Asin.name)
  return new Expr({ asin: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The arc tangent of the number
 * @return {Expr}
 */
function Atan(expr) {
  arity.exact(1, arguments, Atan.name)
  return new Expr({ atan: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The cosine of a number
 * @return {Expr}
 */
function Cos(expr) {
  arity.exact(1, arguments, Cos.name)
  return new Expr({ cos: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The hyperbolic cosine of the number
 * @return {Expr}
 */
function Cosh(expr) {
  arity.exact(1, arguments, Cosh.name)
  return new Expr({ cosh: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   Take radians and convert it to degrees 360 degrees = 2 * pi radians
 * @return {Expr}
 */
function Degrees(expr) {
  arity.exact(1, arguments, Degrees.name)
  return new Expr({ degrees: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The e raised to an exponent number
 * @return {Expr}
 */
function Exp(expr) {
  arity.exact(1, arguments, Exp.name)
  return new Expr({ exp: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A side of the right triangle
 * @param {...module:query~ExprArg} terms
 *   The second side of a right triange, defaults to the first side
 * @return {Expr}
 */
function Hypot(value, side) {
  arity.min(1, arguments, Hypot.name)
  side = defaults(side, null)
  return new Expr(params({ hypot: wrap(value) }, { b: wrap(side) }))
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The natural log of the number
 * @return {Expr}
 */
function Ln(expr) {
  arity.exact(1, arguments, Ln.name)
  return new Expr({ ln: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The log base 10 of a number
 * @return {Expr}
 */
function Log(expr) {
  arity.exact(1, arguments, Log.name)
  return new Expr({ log: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A numbers to raise to the power.
 * @param {...module:query~ExprArg} terms
 *   An optional exponent
 * @return {Expr}
 */
function Pow(value, exponent) {
  arity.min(1, arguments, Pow.name)
  exponent = defaults(exponent, null)
  return new Expr(params({ pow: wrap(value) }, { exp: wrap(exponent) }))
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   Take degrees and convert the number to radians 2 * pi = 360 degrees
 * @return {Expr}
 */
function Radians(expr) {
  arity.exact(1, arguments, Radians.name)
  return new Expr({ radians: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The sine of a number
 * @return {Expr}
 */
function Sin(expr) {
  arity.exact(1, arguments, Sin.name)
  return new Expr({ sin: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The hyperbolic sine of a number
 * @return {Expr}
 */
function Sinh(expr) {
  arity.exact(1, arguments, Sinh.name)
  return new Expr({ sinh: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The Tangent of a number
 * @return {Expr}
 */
function Tan(expr) {
  arity.exact(1, arguments, Tan.name)
  return new Expr({ tan: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#mathematical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   The hyberbolic tangent of a number
 * @return {Expr}
 */
function Tanh(expr) {
  arity.exact(1, arguments, Tanh.name)
  return new Expr({ tanh: wrap(expr) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#logical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of terms to compare.
 * @return {Expr}
 */
function LT() {
  arity.min(1, arguments, LT.name)
  return new Expr({ lt: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#logical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of terms to compare.
 * @return {Expr}
 */
function LTE() {
  arity.min(1, arguments, LTE.name)
  return new Expr({ lte: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#logical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of terms to compare.
 * @return {Expr}
 */
function GT() {
  arity.min(1, arguments, GT.name)
  return new Expr({ gt: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#logical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection of terms to compare.
 * @return {Expr}
 */
function GTE() {
  arity.min(1, arguments, GTE.name)
  return new Expr({ gte: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#logical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection to compute the conjunction of.
 * @return {Expr}
 */
function And() {
  arity.min(1, arguments, And.name)
  return new Expr({ and: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#logical-functions).
 *
 * @param {...module:query~ExprArg} terms
 *   A collection to compute the disjunction of.
 * @return {Expr}
 */
function Or() {
  arity.min(1, arguments, Or.name)
  return new Expr({ or: wrap(varargs(arguments)) })
}

/**
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#logical-functions).
 *
 * @param {module:query~ExprArg} boolean
 *   A boolean to produce the negation of.
 * @return {Expr}
 */
function Not(boolean) {
  arity.exact(1, arguments, Not.name)
  return new Expr({ not: wrap(boolean) })
}

/**
 * Converts an expression to a string literal.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to a string.
 * @return {Expr}
 */
function ToString(expr) {
  arity.exact(1, arguments, ToString.name)
  return new Expr({ to_string: wrap(expr) })
}

/**
 * Converts an expression to a number literal.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to a number.
 * @return {Expr}
 */
function ToNumber(expr) {
  arity.exact(1, arguments, ToNumber.name)
  return new Expr({ to_number: wrap(expr) })
}

/**
 * Converts an expression to an Object.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to an Object.
 * @return {Expr}
 */
function ToObject(expr) {
  arity.exact(1, arguments, ToObject.name)
  return new Expr({ to_object: wrap(expr) })
}

/**
 * Converts an expression to an Array.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to an Array.
 * @return {Expr}
 */
function ToArray(expr) {
  arity.exact(1, arguments, ToArray.name)
  return new Expr({ to_array: wrap(expr) })
}

/**
 * Converts an expression to a double value, if possible.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to a double.
 * @return {Expr}
 */
function ToDouble(expr) {
  arity.exact(1, arguments, ToDouble.name)
  return new Expr({ to_double: wrap(expr) })
}

/**
 * Converts an expression to an integer value, if possible.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to an integer.
 * @return {Expr}
 */
function ToInteger(expr) {
  arity.exact(1, arguments, ToInteger.name)
  return new Expr({ to_integer: wrap(expr) })
}

/**
 * Converts an expression to a time literal.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to a time.
 * @return {Expr}
 */
function ToTime(expr) {
  arity.exact(1, arguments, ToTime.name)
  return new Expr({ to_time: wrap(expr) })
}

/**
 * Converts an expression evaluating to a time to seconds since epoch.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to seconds numeric value.
 * @return {Expr}
 */
function ToSeconds(expr) {
  arity.exact(1, arguments, ToSeconds.name)
  return new Expr({ to_seconds: wrap(expr) })
}

/**
 * Converts a time expression to milliseconds since the UNIX epoch.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to millisecond numeric value.
 * @return {Expr}
 */
function ToMillis(expr) {
  arity.exact(1, arguments, ToMillis.name)
  return new Expr({ to_millis: wrap(expr) })
}

/**
 * Converts a time expression to microseconds since the UNIX epoch.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to microsecond numeric value.
 * @return {Expr}
 */
function ToMicros(expr) {
  arity.exact(1, arguments, ToMicros.name)
  return new Expr({ to_micros: wrap(expr) })
}

/**
 * Returns a time expression's day of the week following ISO-8601 convention, from 1 (Monday) to 7 (Sunday).
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to day of week.
 * @return {Expr}
 */
function DayOfWeek(expr) {
  arity.exact(1, arguments, DayOfWeek.name)
  return new Expr({ day_of_week: wrap(expr) })
}

/**
 * Returns a time expression's day of the year, from 1 to 365, or 366 in a leap year.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to day of year.
 * @return {Expr}
 */
function DayOfYear(expr) {
  arity.exact(1, arguments, DayOfYear.name)
  return new Expr({ day_of_year: wrap(expr) })
}

/**
 * Returns a time expression's day of the month, from 1 to 31.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to day of month.
 * @return {Expr}
 */
function DayOfMonth(expr) {
  arity.exact(1, arguments, DayOfMonth.name)
  return new Expr({ day_of_month: wrap(expr) })
}

/**
 * Returns a time expression's second of the minute, from 0 to 59.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to a hour.
 * @return {Expr}
 */
function Hour(expr) {
  arity.exact(1, arguments, Hour.name)
  return new Expr({ hour: wrap(expr) })
}

/**
 * Returns a time expression's second of the minute, from 0 to 59.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to a month.
 * @return {Expr}
 */
function Minute(expr) {
  arity.exact(1, arguments, Minute.name)
  return new Expr({ minute: wrap(expr) })
}

/**
 * Returns a time expression's second of the minute, from 0 to 59.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to a month.
 * @return {Expr}
 */
function Second(expr) {
  arity.exact(1, arguments, Second.name)
  return new Expr({ second: wrap(expr) })
}

/**
 * Returns a time expression's month of the year, from 1 to 12.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to a month.
 * @return {Expr}
 */
function Month(expr) {
  arity.exact(1, arguments, Month.name)
  return new Expr({ month: wrap(expr) })
}

/**
 * Returns the time expression's year, following the ISO-8601 standard.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to a year.
 * @return {Expr}
 */
function Year(expr) {
  arity.exact(1, arguments, Year.name)
  return new Expr({ year: wrap(expr) })
}

/**
 * Converts an expression to a date literal.
 *
 * @param {module:query~ExprArg} expression
 *   An expression to convert to a date.
 * @return {Expr}
 */
function ToDate(expr) {
  arity.exact(1, arguments, ToDate.name)
  return new Expr({ to_date: wrap(expr) })
}

/**
 * Move database to a new hierarchy.
 *
 * @param {string}  from database reference to be moved.
 * @param {string}  to new parent database reference.
 * @return {Expr}   The expression wrapping the provided object.
 * @see <a href="https://app.fauna.com/documentation/reference/queryapi#write-functions">FaunaDB Write Functions</a>
 */
function MoveDatabase(from, to) {
  arity.exact(2, arguments, MoveDatabase.name)
  return new Expr({ move_database: wrap(from), to: wrap(to) })
}

/**
 * Returns a set of all documents in the given collection.
 * A set must be paginated in order to retrieve its values.
 *
 * @param collection a reference to the collection. Type: Ref
 * @return a new {@link Expr} instance
 * @see #Paginate(Expr)
 */
function Documents(collection) {
  arity.exact(1, arguments, Documents.name)
  return new Expr({ documents: wrap(collection) })
}

// Helpers

/**
 * @ignore
 */
function arity(min, max, args, callerFunc) {
  if (
    (min !== null && args.length < min) ||
    (max !== null && args.length > max)
  ) {
    throw new errors.InvalidArity(min, max, args.length, callerFunc)
  }
}

arity.exact = function(n, args, callerFunc) {
  arity(n, n, args, callerFunc)
}
arity.max = function(n, args, callerFunc) {
  arity(null, n, args, callerFunc)
}
arity.min = function(n, args, callerFunc) {
  arity(n, null, args, callerFunc)
}
arity.between = function(min, max, args, callerFunc) {
  arity(min, max, args, callerFunc)
}

/** Adds optional parameters to the query.
 *
 * @ignore
 * */
function params(mainParams, optionalParams) {
  for (var key in optionalParams) {
    var val = optionalParams[key]
    if (val !== null) {
      mainParams[key] = val
    }
  }
  return mainParams
}

/**
 * Called on rest arguments.
 * This ensures that a single value passed is not put in an array, so
 * `query.add([1, 2])` will work as well as `query.add(1, 2)`.
 *
 * @ignore
 */
function varargs(values) {
  var valuesAsArr = Array.isArray(values)
    ? values
    : Array.prototype.slice.call(values)
  return values.length === 1 ? values[0] : valuesAsArr
}

/**
 * @ignore
 */
function argsToArray(args) {
  var rv = []
  rv.push.apply(rv, args)
  return rv
}

/**
 * @ignore
 */
function defaults(param, def) {
  if (param === undefined) {
    return def
  } else {
    return param
  }
}

/**
 * Wraps an object as an Expression. This will automatically wrap any bare objects with
 * the appropriate {@link object} escaping.
 * @param {Object} obj
 *  The object to be wrapped as an Expression.
 * @returns {Expr}
 *   The expression wrapping the provided object.
 * @private
 */
function wrap(obj) {
  arity.exact(1, arguments, wrap.name)
  if (obj === null) {
    return null
  } else if (obj instanceof Expr) {
    return obj
  } else if (typeof obj === 'symbol') {
    return obj.toString().replace(/Symbol\((.*)\)/, function(str, symbol) {
      return symbol
    })
  } else if (typeof obj === 'function') {
    return Lambda(obj)
  } else if (Array.isArray(obj)) {
    return new Expr(
      obj.map(function(elem) {
        return wrap(elem)
      })
    )
  } else if (obj instanceof Uint8Array || obj instanceof ArrayBuffer) {
    return new values.Bytes(obj)
  } else if (typeof obj === 'object') {
    return new Expr({ object: wrapValues(obj) })
  } else {
    return obj
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
function wrapValues(obj) {
  if (obj !== null) {
    var rv = {}

    Object.keys(obj).forEach(function(key) {
      rv[key] = wrap(obj[key])
    })

    return rv
  } else {
    return null
  }
}

module.exports = {
  Ref: Ref,
  Bytes: Bytes,
  Abort: Abort,
  At: At,
  Let: Let,
  Var: Var,
  If: If,
  Do: Do,
  Object: objectFunction,
  Lambda: Lambda,
  Call: Call,
  Query: Query,
  Map: Map,
  Foreach: Foreach,
  Filter: Filter,
  Take: Take,
  Drop: Drop,
  Prepend: Prepend,
  Append: Append,
  IsEmpty: IsEmpty,
  IsNonEmpty: IsNonEmpty,
  IsNumber: IsNumber,
  IsDouble: IsDouble,
  IsInteger: IsInteger,
  IsBoolean: IsBoolean,
  IsNull: IsNull,
  IsBytes: IsBytes,
  IsTimestamp: IsTimestamp,
  IsDate: IsDate,
  IsString: IsString,
  IsArray: IsArray,
  IsObject: IsObject,
  IsRef: IsRef,
  IsSet: IsSet,
  IsDoc: IsDoc,
  IsLambda: IsLambda,
  IsCollection: IsCollection,
  IsDatabase: IsDatabase,
  IsIndex: IsIndex,
  IsFunction: IsFunction,
  IsKey: IsKey,
  IsToken: IsToken,
  IsCredentials: IsCredentials,
  IsRole: IsRole,
  Get: Get,
  KeyFromSecret: KeyFromSecret,
  Reduce: Reduce,
  Paginate: Paginate,
  Exists: Exists,
  Create: Create,
  Update: Update,
  Replace: Replace,
  Delete: Delete,
  Insert: Insert,
  Remove: Remove,
  CreateClass: deprecate(
    CreateClass,
    'CreateClass() is deprecated, use CreateCollection() instead'
  ),
  CreateCollection: CreateCollection,
  CreateDatabase: CreateDatabase,
  CreateIndex: CreateIndex,
  CreateKey: CreateKey,
  CreateFunction: CreateFunction,
  CreateRole: CreateRole,
  Singleton: Singleton,
  Events: Events,
  Match: Match,
  Union: Union,
  Merge: Merge,
  Intersection: Intersection,
  Difference: Difference,
  Distinct: Distinct,
  Join: Join,
  Range: Range,
  Login: Login,
  Logout: Logout,
  Identify: Identify,
  Identity: Identity,
  HasIdentity: HasIdentity,
  Concat: Concat,
  Casefold: Casefold,
  ContainsStr: ContainsStr,
  ContainsStrRegex: ContainsStrRegex,
  StartsWith: StartsWith,
  EndsWith: EndsWith,
  FindStr: FindStr,
  FindStrRegex: FindStrRegex,
  Length: Length,
  LowerCase: LowerCase,
  LTrim: LTrim,
  NGram: NGram,
  Repeat: Repeat,
  ReplaceStr: ReplaceStr,
  ReplaceStrRegex: ReplaceStrRegex,
  RegexEscape: RegexEscape,
  RTrim: RTrim,
  Space: Space,
  SubString: SubString,
  TitleCase: TitleCase,
  Trim: Trim,
  UpperCase: UpperCase,
  Format: Format,
  Time: Time,
  TimeAdd: TimeAdd,
  TimeSubtract: TimeSubtract,
  TimeDiff: TimeDiff,
  Epoch: Epoch,
  Date: Date,
  Now: Now,
  NextId: deprecate(NextId, 'NextId() is deprecated, use NewId() instead'),
  NewId: NewId,
  Database: Database,
  Index: Index,
  Class: deprecate(Class, 'Class() is deprecated, use Collection() instead'),
  Collection: Collection,
  Function: FunctionFn,
  Role: Role,
  Classes: deprecate(
    Classes,
    'Classes() is deprecated, use Collections() instead'
  ),
  Collections: Collections,
  Databases: Databases,
  Indexes: Indexes,
  Functions: Functions,
  Roles: Roles,
  Keys: Keys,
  Tokens: Tokens,
  Credentials: Credentials,
  Equals: Equals,
  Contains: Contains,
  Select: Select,
  SelectAll: deprecate(SelectAll, 'SelectAll() is deprecated. Avoid use.'),
  Abs: Abs,
  Add: Add,
  BitAnd: BitAnd,
  BitNot: BitNot,
  BitOr: BitOr,
  BitXor: BitXor,
  Ceil: Ceil,
  Divide: Divide,
  Floor: Floor,
  Max: Max,
  Min: Min,
  Modulo: Modulo,
  Multiply: Multiply,
  Round: Round,
  Subtract: Subtract,
  Sign: Sign,
  Sqrt: Sqrt,
  Trunc: Trunc,
  Count: Count,
  Sum: Sum,
  Mean: Mean,
  Any: Any,
  All: All,
  Acos: Acos,
  Asin: Asin,
  Atan: Atan,
  Cos: Cos,
  Cosh: Cosh,
  Degrees: Degrees,
  Exp: Exp,
  Hypot: Hypot,
  Ln: Ln,
  Log: Log,
  Pow: Pow,
  Radians: Radians,
  Sin: Sin,
  Sinh: Sinh,
  Tan: Tan,
  Tanh: Tanh,
  LT: LT,
  LTE: LTE,
  GT: GT,
  GTE: GTE,
  And: And,
  Or: Or,
  Not: Not,
  ToString: ToString,
  ToNumber: ToNumber,
  ToObject: ToObject,
  ToArray: ToArray,
  ToDouble: ToDouble,
  ToInteger: ToInteger,
  ToTime: ToTime,
  ToSeconds: ToSeconds,
  ToMicros: ToMicros,
  ToMillis: ToMillis,
  DayOfMonth: DayOfMonth,
  DayOfWeek: DayOfWeek,
  DayOfYear: DayOfYear,
  Second: Second,
  Minute: Minute,
  Hour: Hour,
  Month: Month,
  Year: Year,
  ToDate: ToDate,
  MoveDatabase: MoveDatabase,
  Documents: Documents,
  wrap: wrap,
}

},{"./Expr":13,"./errors":19,"./values":21,"fn-annotate":22,"object-assign":27,"util-deprecate":58}],21:[function(require,module,exports){
'use strict'

var base64 = require('base64-js')
var deprecate = require('util-deprecate')
var errors = require('./errors')
var Expr = require('./Expr')
var util = require('util')

var customInspect = util && util.inspect && util.inspect.custom
var stringify = (util && util.inspect) || JSON.stringify

/**
 * FaunaDB value types. Generally, these collections do not need to be instantiated
 * directly; they can be constructed through helper methods in {@link module:query}.
 *
 * Instances of these collections will be returned in responses if the response object
 * contains these values. For example, a FaunaDB response containing
 *`{ "@ref": { "id": "123", "collection": { "@ref": { "id": "frogs", "collection": { "@ref": { "id": "collectiones" } } } } } }`
 * will be returned as `new values.Ref("123", new values.Ref("frogs", values.Native.COLLECTIONS))`.
 *
 * See the [FaunaDB Query API Documentation](https://app.fauna.com/documentation/reference/queryapi#simple-type)
 * for more information.
 *
 * @module values
 */

/**
 * Base type for FaunaDB value objects.
 *
 * @extends Expr
 * @abstract
 * @constructor
 */
function Value() {}

util.inherits(Value, Expr)

/**
 * FaunaDB ref.
 * See the [docs](https://app.fauna.com/documentation/reference/queryapi#special-type).
 *
 * @param {string} id
 *   The id portion of the ref.
 * @param {Ref} [collection]
 *   The collection portion of the ref.
 * @param {Ref} [database]
 *   The database portion of the ref.
 *
 * @extends module:values~Value
 * @constructor
 */
function Ref(id, collection, database) {
  if (!id) throw new errors.InvalidValue('id cannot be null or undefined')

  this.value = { id: id }
  if (collection) this.value['collection'] = collection
  if (database) this.value['database'] = database
}

util.inherits(Ref, Value)

/**
 * Gets the collection part out of the Ref.
 *
 * @member {string}
 * @name module:values~Ref#collection
 */
Object.defineProperty(Ref.prototype, 'collection', {
  get: function() {
    return this.value['collection']
  },
})

/**
 * DEPRECATED. Gets the class part out of the Ref.
 *
 * @member {string}
 * @name module:values~Ref#class
 */
Object.defineProperty(Ref.prototype, 'class', {
  get: deprecate(function() {
    return this.value['collection']
  }, 'class is deprecated, use collection instead'),
})

/**
 * Gets the database part out of the Ref.
 *
 * @member {Ref}
 * @name module:values~Ref#database
 */
Object.defineProperty(Ref.prototype, 'database', {
  get: function() {
    return this.value['database']
  },
})

/**
 * Gets the id part out of the Ref.
 *
 * @member {Ref}
 * @name module:values~Ref#id
 */
Object.defineProperty(Ref.prototype, 'id', {
  get: function() {
    return this.value['id']
  },
})

/** @ignore */
Ref.prototype.toJSON = function() {
  return { '@ref': this.value }
}

wrapToString(Ref, function() {
  var constructors = {
    collections: 'Collection',
    databases: 'Database',
    indexes: 'Index',
    functions: 'Function',
    roles: 'Role',
  }

  var toString = function(ref) {
    if (ref.collection === undefined) {
      var db = ref.database !== undefined ? ref.database.toString() : ''
      return ref.id.charAt(0).toUpperCase() + ref.id.slice(1) + '(' + db + ')'
    }

    var constructor = constructors[ref.collection.id]
    if (constructor !== undefined) {
      var db = ref.database !== undefined ? ', ' + ref.database.toString() : ''
      return constructor + '("' + ref.id + '"' + db + ')'
    }

    return 'Ref(' + toString(ref.collection) + ', "' + ref.id + '")'
  }

  return toString(this)
})

/** @ignore */
Ref.prototype.valueOf = function() {
  return this.value
}

/**
 * Whether these are both Refs and have the same value.
 * @param {any} other
 * @returns {boolean}
 */
Ref.prototype.equals = function(other) {
  return (
    other instanceof Ref &&
    this.id === other.id &&
    ((this.collection === undefined && other.collection === undefined) ||
      this.collection.equals(other.collection)) &&
    ((this.database === undefined && other.database === undefined) ||
      this.database.equals(other.database))
  )
}

var Native = {
  COLLECTIONS: new Ref('collections'),
  INDEXES: new Ref('indexes'),
  DATABASES: new Ref('databases'),
  FUNCTIONS: new Ref('functions'),
  ROLES: new Ref('roles'),
  KEYS: new Ref('keys'),
}

Native.fromName = function(name) {
  switch (name) {
    case 'collections':
      return Native.COLLECTIONS
    case 'indexes':
      return Native.INDEXES
    case 'databases':
      return Native.DATABASES
    case 'functions':
      return Native.FUNCTIONS
    case 'roles':
      return Native.ROLES
    case 'keys':
      return Native.KEYS
  }
  return new Ref(name)
}

/**
 * FaunaDB Set.
 * This represents a set returned as part of a response.
 * This looks like `{"@set": set_query}`.
 * For query sets see {@link match}, {@link union},
 * {@link intersection}, {@link difference}, and {@link join}.
 *
 * @extends module:values~Value
 * @constructor
 */
function SetRef(value) {
  /** Raw query object. */
  this.value = value
}

util.inherits(SetRef, Value)

wrapToString(SetRef, function() {
  return Expr.toString(this.value)
})

/** @ignore */
SetRef.prototype.toJSON = function() {
  return { '@set': this.value }
}

/** FaunaDB time. See the [docs](https://app.fauna.com/documentation/reference/queryapi#special-type).
 *
 * @param {string|Date} value If a Date, this is converted to a string.
 * @extends module:values~Value
 * @constructor
 */
function FaunaTime(value) {
  if (value instanceof Date) {
    value = value.toISOString()
  } else if (!(value.charAt(value.length - 1) === 'Z')) {
    throw new errors.InvalidValue("Only allowed timezone is 'Z', got: " + value)
  }

  this.value = value
}

util.inherits(FaunaTime, Value)

/**
 * Returns the date wrapped by this object.
 * This is lossy as Dates have millisecond rather than nanosecond precision.
 *
 * @member {Date}
 * @name module:values~FaunaTime#date
 */
Object.defineProperty(FaunaTime.prototype, 'date', {
  get: function() {
    return new Date(this.value)
  },
})

wrapToString(FaunaTime, function() {
  return 'Time("' + this.value + '")'
})

/** @ignore */
FaunaTime.prototype.toJSON = function() {
  return { '@ts': this.value }
}

/** FaunaDB date. See the [docs](https://app.fauna.com/documentation/reference/queryapi#special-type).
 *
 * @param {string|Date} value
 *   If a Date, this is converted to a string, with time-of-day discarded.
 * @extends module:values~Value
 * @constructor
 */
function FaunaDate(value) {
  if (value instanceof Date) {
    // The first 10 characters 'YYYY-MM-DD' are the date portion.
    value = value.toISOString().slice(0, 10)
  }

  /**
   * ISO8601 date.
   * @type {string}
   */
  this.value = value
}

util.inherits(FaunaDate, Value)

/**
 * @member {Date}
 * @name module:values~FaunaDate#date
 */
Object.defineProperty(FaunaDate.prototype, 'date', {
  get: function() {
    return new Date(this.value)
  },
})

wrapToString(FaunaDate, function() {
  return 'Date("' + this.value + '")'
})

/** @ignore */
FaunaDate.prototype.toJSON = function() {
  return { '@date': this.value }
}

/** FaunaDB bytes. See the [docs](https://app.fauna.com/documentation/reference/queryapi#special-type).
 *
 * @param {Uint8Array|ArrayBuffer|string} value
 *    If ArrayBuffer it's converted to Uint8Array
 *    If string it must be base64 encoded and it's converted to Uint8Array
 * @extends module:values~Value
 * @constructor
 */
function Bytes(value) {
  if (value instanceof ArrayBuffer) {
    this.value = new Uint8Array(value)
  } else if (typeof value === 'string') {
    this.value = base64.toByteArray(value)
  } else if (value instanceof Uint8Array) {
    this.value = value
  } else {
    throw new errors.InvalidValue(
      'Bytes type expect argument to be either Uint8Array|ArrayBuffer|string, got: ' +
        stringify(value)
    )
  }
}

util.inherits(Bytes, Value)

wrapToString(Bytes, function() {
  return 'Bytes("' + base64.fromByteArray(this.value) + '")'
})

/** @ignore */
Bytes.prototype.toJSON = function() {
  return { '@bytes': base64.fromByteArray(this.value) }
}

/** FaunaDB query. See the [docs](https://app.fauna.com/documentation/reference/queryapi#special-type).
 *
 * @param {any} value
 * @extends module:values~Value
 * @constructor
 */
function Query(value) {
  this.value = value
}

util.inherits(Query, Value)

wrapToString(Query, function() {
  return 'Query(' + Expr.toString(this.value) + ')'
})

/** @ignore */
Query.prototype.toJSON = function() {
  return { '@query': this.value }
}

/** @ignore */
function wrapToString(type, fn) {
  type.prototype.toString = fn
  type.prototype.inspect = fn

  if (customInspect) {
    type.prototype[customInspect] = fn
  }
}

module.exports = {
  Value: Value,
  Ref: Ref,
  Native: Native,
  SetRef: SetRef,
  FaunaTime: FaunaTime,
  FaunaDate: FaunaDate,
  Bytes: Bytes,
  Query: Query,
}

},{"./Expr":13,"./errors":19,"base64-js":1,"util":61,"util-deprecate":58}],22:[function(require,module,exports){
'use strict';

module.exports = annotate;

function annotate(fn) {

  if (typeof fn !== 'function') {
    throw new Error('Could not parse function signature for injection dependencies: Object is not a function');
  }

  if (!fn.length) return [];

  var injects = /^()\(?([^)=]*)\)? *=>/.exec(fn + '') ||
                /^[^(]+([^ \(]*) *\(([^\)]*)\)/.exec(fn + '');

  if (!injects) {
    throw new Error('Could not parse function signature for injection dependencies: ' + fn + '');
  }

  var argumentString = injects[2]

  // Strip multi-line comments:
  // Uses the lazy-quantifier (.*?): http://www.rexegg.com/regex-quantifiers.html#lazy_solution
  .replace(/\/\*[\S\s]*?\*\//g, ' ')

  // Strip single-line comments:
  .replace(/\/\/.*/g, ' ');

  function groupSubArguments(_, type, keys) {
    return type + keys.split(',')
    .map(function (arg) {
      return arg && arg.trim();
    })
    .filter(Boolean)
    .join('@');
  }

  argumentString = argumentString.replace(/(\{)([^}]*)\}/g, groupSubArguments);
  argumentString = argumentString.replace(/(\[)([^}]*)\]/g, groupSubArguments);

  return argumentString.split(',')
  .map(function (arg) {
    return arg && arg.trim();
  })
  .map(function (arg) {
    if (arg[0] === '{') {
      return arg.substring(1).split('@');
    }
    if (arg[0] === '[') {
      return { items: arg.substring(1).split('@') };
    }
    return arg;
  })
  .filter(Boolean);

}

},{}],23:[function(require,module,exports){
var http = require('http')
var url = require('url')

var https = module.exports

for (var key in http) {
  if (http.hasOwnProperty(key)) https[key] = http[key]
}

https.request = function (params, cb) {
  params = validateParams(params)
  return http.request.call(this, params, cb)
}

https.get = function (params, cb) {
  params = validateParams(params)
  return http.get.call(this, params, cb)
}

function validateParams (params) {
  if (typeof params === 'string') {
    params = url.parse(params)
  }
  if (!params.protocol) {
    params.protocol = 'https:'
  }
  if (params.protocol !== 'https:') {
    throw new Error('Protocol "' + params.protocol + '" not supported. Expected "https:"')
  }
  return params
}

},{"http":35,"url":56}],24:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],25:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],26:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],27:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],28:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],29:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],30:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],31:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":29,"./encode":30}],32:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encodeURIComponent(key);
      value = encodeURIComponent(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

},{}],33:[function(require,module,exports){
'use strict';

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

},{}],34:[function(require,module,exports){
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":5}],35:[function(require,module,exports){
(function (global){
var ClientRequest = require('./lib/request')
var response = require('./lib/response')
var extend = require('xtend')
var statusCodes = require('builtin-status-codes')
var url = require('url')

var http = exports

http.request = function (opts, cb) {
	if (typeof opts === 'string')
		opts = url.parse(opts)
	else
		opts = extend(opts)

	// Normally, the page is loaded from http or https, so not specifying a protocol
	// will result in a (valid) protocol-relative url. However, this won't work if
	// the protocol is something else, like 'file:'
	var defaultProtocol = global.location.protocol.search(/^https?:$/) === -1 ? 'http:' : ''

	var protocol = opts.protocol || defaultProtocol
	var host = opts.hostname || opts.host
	var port = opts.port
	var path = opts.path || '/'

	// Necessary for IPv6 addresses
	if (host && host.indexOf(':') !== -1)
		host = '[' + host + ']'

	// This may be a relative url. The browser should always be able to interpret it correctly.
	opts.url = (host ? (protocol + '//' + host) : '') + (port ? ':' + port : '') + path
	opts.method = (opts.method || 'GET').toUpperCase()
	opts.headers = opts.headers || {}

	// Also valid opts.auth, opts.mode

	var req = new ClientRequest(opts)
	if (cb)
		req.on('response', cb)
	return req
}

http.get = function get (opts, cb) {
	var req = http.request(opts, cb)
	req.end()
	return req
}

http.ClientRequest = ClientRequest
http.IncomingMessage = response.IncomingMessage

http.Agent = function () {}
http.Agent.defaultMaxSockets = 4

http.globalAgent = new http.Agent()

http.STATUS_CODES = statusCodes

http.METHODS = [
	'CHECKOUT',
	'CONNECT',
	'COPY',
	'DELETE',
	'GET',
	'HEAD',
	'LOCK',
	'M-SEARCH',
	'MERGE',
	'MKACTIVITY',
	'MKCOL',
	'MOVE',
	'NOTIFY',
	'OPTIONS',
	'PATCH',
	'POST',
	'PROPFIND',
	'PROPPATCH',
	'PURGE',
	'PUT',
	'REPORT',
	'SEARCH',
	'SUBSCRIBE',
	'TRACE',
	'UNLOCK',
	'UNSUBSCRIBE'
]
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/request":37,"./lib/response":38,"builtin-status-codes":6,"url":56,"xtend":62}],36:[function(require,module,exports){
(function (global){
exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream)

exports.writableStream = isFunction(global.WritableStream)

exports.abortController = isFunction(global.AbortController)

// The xhr request to example.com may violate some restrictive CSP configurations,
// so if we're running in a browser that supports `fetch`, avoid calling getXHR()
// and assume support for certain features below.
var xhr
function getXHR () {
	// Cache the xhr value
	if (xhr !== undefined) return xhr

	if (global.XMLHttpRequest) {
		xhr = new global.XMLHttpRequest()
		// If XDomainRequest is available (ie only, where xhr might not work
		// cross domain), use the page location. Otherwise use example.com
		// Note: this doesn't actually make an http request.
		try {
			xhr.open('GET', global.XDomainRequest ? '/' : 'https://example.com')
		} catch(e) {
			xhr = null
		}
	} else {
		// Service workers don't have XHR
		xhr = null
	}
	return xhr
}

function checkTypeSupport (type) {
	var xhr = getXHR()
	if (!xhr) return false
	try {
		xhr.responseType = type
		return xhr.responseType === type
	} catch (e) {}
	return false
}

// If fetch is supported, then arraybuffer will be supported too. Skip calling
// checkTypeSupport(), since that calls getXHR().
exports.arraybuffer = exports.fetch || checkTypeSupport('arraybuffer')

// These next two tests unavoidably show warnings in Chrome. Since fetch will always
// be used if it's available, just return false for these to avoid the warnings.
exports.msstream = !exports.fetch && checkTypeSupport('ms-stream')
exports.mozchunkedarraybuffer = !exports.fetch && checkTypeSupport('moz-chunked-arraybuffer')

// If fetch is supported, then overrideMimeType will be supported too. Skip calling
// getXHR().
exports.overrideMimeType = exports.fetch || (getXHR() ? isFunction(getXHR().overrideMimeType) : false)

function isFunction (value) {
	return typeof value === 'function'
}

xhr = null // Help gc

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],37:[function(require,module,exports){
(function (process,global,Buffer){
var capability = require('./capability')
var inherits = require('inherits')
var response = require('./response')
var stream = require('readable-stream')

var IncomingMessage = response.IncomingMessage
var rStates = response.readyStates

function decideMode (preferBinary, useFetch) {
	if (capability.fetch && useFetch) {
		return 'fetch'
	} else if (capability.mozchunkedarraybuffer) {
		return 'moz-chunked-arraybuffer'
	} else if (capability.msstream) {
		return 'ms-stream'
	} else if (capability.arraybuffer && preferBinary) {
		return 'arraybuffer'
	} else {
		return 'text'
	}
}

var ClientRequest = module.exports = function (opts) {
	var self = this
	stream.Writable.call(self)

	self._opts = opts
	self._body = []
	self._headers = {}
	if (opts.auth)
		self.setHeader('Authorization', 'Basic ' + Buffer.from(opts.auth).toString('base64'))
	Object.keys(opts.headers).forEach(function (name) {
		self.setHeader(name, opts.headers[name])
	})

	var preferBinary
	var useFetch = true
	if (opts.mode === 'disable-fetch' || ('requestTimeout' in opts && !capability.abortController)) {
		// If the use of XHR should be preferred. Not typically needed.
		useFetch = false
		preferBinary = true
	} else if (opts.mode === 'prefer-streaming') {
		// If streaming is a high priority but binary compatibility and
		// the accuracy of the 'content-type' header aren't
		preferBinary = false
	} else if (opts.mode === 'allow-wrong-content-type') {
		// If streaming is more important than preserving the 'content-type' header
		preferBinary = !capability.overrideMimeType
	} else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
		// Use binary if text streaming may corrupt data or the content-type header, or for speed
		preferBinary = true
	} else {
		throw new Error('Invalid value for opts.mode')
	}
	self._mode = decideMode(preferBinary, useFetch)
	self._fetchTimer = null

	self.on('finish', function () {
		self._onFinish()
	})
}

inherits(ClientRequest, stream.Writable)

ClientRequest.prototype.setHeader = function (name, value) {
	var self = this
	var lowerName = name.toLowerCase()
	// This check is not necessary, but it prevents warnings from browsers about setting unsafe
	// headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
	// http-browserify did it, so I will too.
	if (unsafeHeaders.indexOf(lowerName) !== -1)
		return

	self._headers[lowerName] = {
		name: name,
		value: value
	}
}

ClientRequest.prototype.getHeader = function (name) {
	var header = this._headers[name.toLowerCase()]
	if (header)
		return header.value
	return null
}

ClientRequest.prototype.removeHeader = function (name) {
	var self = this
	delete self._headers[name.toLowerCase()]
}

ClientRequest.prototype._onFinish = function () {
	var self = this

	if (self._destroyed)
		return
	var opts = self._opts

	var headersObj = self._headers
	var body = null
	if (opts.method !== 'GET' && opts.method !== 'HEAD') {
        body = new Blob(self._body, {
            type: (headersObj['content-type'] || {}).value || ''
        });
    }

	// create flattened list of headers
	var headersList = []
	Object.keys(headersObj).forEach(function (keyName) {
		var name = headersObj[keyName].name
		var value = headersObj[keyName].value
		if (Array.isArray(value)) {
			value.forEach(function (v) {
				headersList.push([name, v])
			})
		} else {
			headersList.push([name, value])
		}
	})

	if (self._mode === 'fetch') {
		var signal = null
		var fetchTimer = null
		if (capability.abortController) {
			var controller = new AbortController()
			signal = controller.signal
			self._fetchAbortController = controller

			if ('requestTimeout' in opts && opts.requestTimeout !== 0) {
				self._fetchTimer = global.setTimeout(function () {
					self.emit('requestTimeout')
					if (self._fetchAbortController)
						self._fetchAbortController.abort()
				}, opts.requestTimeout)
			}
		}

		global.fetch(self._opts.url, {
			method: self._opts.method,
			headers: headersList,
			body: body || undefined,
			mode: 'cors',
			credentials: opts.withCredentials ? 'include' : 'same-origin',
			signal: signal
		}).then(function (response) {
			self._fetchResponse = response
			self._connect()
		}, function (reason) {
			global.clearTimeout(self._fetchTimer)
			if (!self._destroyed)
				self.emit('error', reason)
		})
	} else {
		var xhr = self._xhr = new global.XMLHttpRequest()
		try {
			xhr.open(self._opts.method, self._opts.url, true)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}

		// Can't set responseType on really old browsers
		if ('responseType' in xhr)
			xhr.responseType = self._mode

		if ('withCredentials' in xhr)
			xhr.withCredentials = !!opts.withCredentials

		if (self._mode === 'text' && 'overrideMimeType' in xhr)
			xhr.overrideMimeType('text/plain; charset=x-user-defined')

		if ('requestTimeout' in opts) {
			xhr.timeout = opts.requestTimeout
			xhr.ontimeout = function () {
				self.emit('requestTimeout')
			}
		}

		headersList.forEach(function (header) {
			xhr.setRequestHeader(header[0], header[1])
		})

		self._response = null
		xhr.onreadystatechange = function () {
			switch (xhr.readyState) {
				case rStates.LOADING:
				case rStates.DONE:
					self._onXHRProgress()
					break
			}
		}
		// Necessary for streaming in Firefox, since xhr.response is ONLY defined
		// in onprogress, not in onreadystatechange with xhr.readyState = 3
		if (self._mode === 'moz-chunked-arraybuffer') {
			xhr.onprogress = function () {
				self._onXHRProgress()
			}
		}

		xhr.onerror = function () {
			if (self._destroyed)
				return
			self.emit('error', new Error('XHR error'))
		}

		try {
			xhr.send(body)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}
	}
}

/**
 * Checks if xhr.status is readable and non-zero, indicating no error.
 * Even though the spec says it should be available in readyState 3,
 * accessing it throws an exception in IE8
 */
function statusValid (xhr) {
	try {
		var status = xhr.status
		return (status !== null && status !== 0)
	} catch (e) {
		return false
	}
}

ClientRequest.prototype._onXHRProgress = function () {
	var self = this

	if (!statusValid(self._xhr) || self._destroyed)
		return

	if (!self._response)
		self._connect()

	self._response._onXHRProgress()
}

ClientRequest.prototype._connect = function () {
	var self = this

	if (self._destroyed)
		return

	self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode, self._fetchTimer)
	self._response.on('error', function(err) {
		self.emit('error', err)
	})

	self.emit('response', self._response)
}

ClientRequest.prototype._write = function (chunk, encoding, cb) {
	var self = this

	self._body.push(chunk)
	cb()
}

ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () {
	var self = this
	self._destroyed = true
	global.clearTimeout(self._fetchTimer)
	if (self._response)
		self._response._destroyed = true
	if (self._xhr)
		self._xhr.abort()
	else if (self._fetchAbortController)
		self._fetchAbortController.abort()
}

ClientRequest.prototype.end = function (data, encoding, cb) {
	var self = this
	if (typeof data === 'function') {
		cb = data
		data = undefined
	}

	stream.Writable.prototype.end.call(self, data, encoding, cb)
}

ClientRequest.prototype.flushHeaders = function () {}
ClientRequest.prototype.setTimeout = function () {}
ClientRequest.prototype.setNoDelay = function () {}
ClientRequest.prototype.setSocketKeepAlive = function () {}

// Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
var unsafeHeaders = [
	'accept-charset',
	'accept-encoding',
	'access-control-request-headers',
	'access-control-request-method',
	'connection',
	'content-length',
	'cookie',
	'cookie2',
	'date',
	'dnt',
	'expect',
	'host',
	'keep-alive',
	'origin',
	'referer',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'via'
]

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"./capability":36,"./response":38,"_process":28,"buffer":5,"inherits":25,"readable-stream":53}],38:[function(require,module,exports){
(function (process,global,Buffer){
var capability = require('./capability')
var inherits = require('inherits')
var stream = require('readable-stream')

var rStates = exports.readyStates = {
	UNSENT: 0,
	OPENED: 1,
	HEADERS_RECEIVED: 2,
	LOADING: 3,
	DONE: 4
}

var IncomingMessage = exports.IncomingMessage = function (xhr, response, mode, fetchTimer) {
	var self = this
	stream.Readable.call(self)

	self._mode = mode
	self.headers = {}
	self.rawHeaders = []
	self.trailers = {}
	self.rawTrailers = []

	// Fake the 'close' event, but only once 'end' fires
	self.on('end', function () {
		// The nextTick is necessary to prevent the 'request' module from causing an infinite loop
		process.nextTick(function () {
			self.emit('close')
		})
	})

	if (mode === 'fetch') {
		self._fetchResponse = response

		self.url = response.url
		self.statusCode = response.status
		self.statusMessage = response.statusText
		
		response.headers.forEach(function (header, key){
			self.headers[key.toLowerCase()] = header
			self.rawHeaders.push(key, header)
		})

		if (capability.writableStream) {
			var writable = new WritableStream({
				write: function (chunk) {
					return new Promise(function (resolve, reject) {
						if (self._destroyed) {
							reject()
						} else if(self.push(Buffer.from(chunk))) {
							resolve()
						} else {
							self._resumeFetch = resolve
						}
					})
				},
				close: function () {
					global.clearTimeout(fetchTimer)
					if (!self._destroyed)
						self.push(null)
				},
				abort: function (err) {
					if (!self._destroyed)
						self.emit('error', err)
				}
			})

			try {
				response.body.pipeTo(writable).catch(function (err) {
					global.clearTimeout(fetchTimer)
					if (!self._destroyed)
						self.emit('error', err)
				})
				return
			} catch (e) {} // pipeTo method isn't defined. Can't find a better way to feature test this
		}
		// fallback for when writableStream or pipeTo aren't available
		var reader = response.body.getReader()
		function read () {
			reader.read().then(function (result) {
				if (self._destroyed)
					return
				if (result.done) {
					global.clearTimeout(fetchTimer)
					self.push(null)
					return
				}
				self.push(Buffer.from(result.value))
				read()
			}).catch(function (err) {
				global.clearTimeout(fetchTimer)
				if (!self._destroyed)
					self.emit('error', err)
			})
		}
		read()
	} else {
		self._xhr = xhr
		self._pos = 0

		self.url = xhr.responseURL
		self.statusCode = xhr.status
		self.statusMessage = xhr.statusText
		var headers = xhr.getAllResponseHeaders().split(/\r?\n/)
		headers.forEach(function (header) {
			var matches = header.match(/^([^:]+):\s*(.*)/)
			if (matches) {
				var key = matches[1].toLowerCase()
				if (key === 'set-cookie') {
					if (self.headers[key] === undefined) {
						self.headers[key] = []
					}
					self.headers[key].push(matches[2])
				} else if (self.headers[key] !== undefined) {
					self.headers[key] += ', ' + matches[2]
				} else {
					self.headers[key] = matches[2]
				}
				self.rawHeaders.push(matches[1], matches[2])
			}
		})

		self._charset = 'x-user-defined'
		if (!capability.overrideMimeType) {
			var mimeType = self.rawHeaders['mime-type']
			if (mimeType) {
				var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/)
				if (charsetMatch) {
					self._charset = charsetMatch[1].toLowerCase()
				}
			}
			if (!self._charset)
				self._charset = 'utf-8' // best guess
		}
	}
}

inherits(IncomingMessage, stream.Readable)

IncomingMessage.prototype._read = function () {
	var self = this

	var resolve = self._resumeFetch
	if (resolve) {
		self._resumeFetch = null
		resolve()
	}
}

IncomingMessage.prototype._onXHRProgress = function () {
	var self = this

	var xhr = self._xhr

	var response = null
	switch (self._mode) {
		case 'text':
			response = xhr.responseText
			if (response.length > self._pos) {
				var newData = response.substr(self._pos)
				if (self._charset === 'x-user-defined') {
					var buffer = Buffer.alloc(newData.length)
					for (var i = 0; i < newData.length; i++)
						buffer[i] = newData.charCodeAt(i) & 0xff

					self.push(buffer)
				} else {
					self.push(newData, self._charset)
				}
				self._pos = response.length
			}
			break
		case 'arraybuffer':
			if (xhr.readyState !== rStates.DONE || !xhr.response)
				break
			response = xhr.response
			self.push(Buffer.from(new Uint8Array(response)))
			break
		case 'moz-chunked-arraybuffer': // take whole
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING || !response)
				break
			self.push(Buffer.from(new Uint8Array(response)))
			break
		case 'ms-stream':
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING)
				break
			var reader = new global.MSStreamReader()
			reader.onprogress = function () {
				if (reader.result.byteLength > self._pos) {
					self.push(Buffer.from(new Uint8Array(reader.result.slice(self._pos))))
					self._pos = reader.result.byteLength
				}
			}
			reader.onload = function () {
				self.push(null)
			}
			// reader.onerror = ??? // TODO: this
			reader.readAsArrayBuffer(response)
			break
	}

	// The ms-stream case handles end separately in reader.onload()
	if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
		self.push(null)
	}
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"./capability":36,"_process":28,"buffer":5,"inherits":25,"readable-stream":53}],39:[function(require,module,exports){
'use strict';

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var codes = {};

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError =
  /*#__PURE__*/
  function (_Base) {
    _inheritsLoose(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
    }

    return NodeError;
  }(Base);

  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;
  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"';
}, TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  var determiner;

  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  }

  msg += ". Received type ".concat(typeof actual);
  return msg;
}, TypeError);
createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented';
});
createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg;
}, TypeError);
createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');
module.exports.codes = codes;

},{}],40:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.
'use strict';
/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


module.exports = Duplex;

var Readable = require('./_stream_readable');

var Writable = require('./_stream_writable');

require('inherits')(Duplex, Readable);

{
  // Allow the keys array to be GC'ed.
  var keys = objectKeys(Writable.prototype);

  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  this.allowHalfOpen = true;

  if (options) {
    if (options.readable === false) this.readable = false;
    if (options.writable === false) this.writable = false;

    if (options.allowHalfOpen === false) {
      this.allowHalfOpen = false;
      this.once('end', onend);
    }
  }
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});
Object.defineProperty(Duplex.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
Object.defineProperty(Duplex.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
}); // the no-half-open enforcer

function onend() {
  // If the writable side ended, then we're ok.
  if (this._writableState.ended) return; // no more data can be written.
  // But allow more writes to happen in this tick.

  process.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }

    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});
}).call(this,require('_process'))
},{"./_stream_readable":42,"./_stream_writable":44,"_process":28,"inherits":25}],41:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.
'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

require('inherits')(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":43,"inherits":25}],42:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

module.exports = Readable;
/*<replacement>*/

var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;
/*<replacement>*/

var EE = require('events').EventEmitter;

var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/


var Stream = require('./internal/streams/stream');
/*</replacement>*/


var Buffer = require('buffer').Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*<replacement>*/


var debugUtil = require('util');

var debug;

if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/


var BufferList = require('./internal/streams/buffer_list');

var destroyImpl = require('./internal/streams/destroy');

var _require = require('./internal/streams/state'),
    getHighWaterMark = _require.getHighWaterMark;

var _require$codes = require('../errors').codes,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT; // Lazy loaded to improve the startup performance.


var StringDecoder;
var createReadableStreamAsyncIterator;
var from;

require('inherits')(Readable, Stream);

var errorOrDestroy = destroyImpl.errorOrDestroy;
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.

  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream, isDuplex) {
  Duplex = Duplex || require('./_stream_duplex');
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"

  this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex); // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()

  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.

  this.sync = true; // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.paused = true; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'end' (and potentially 'finish')

  this.autoDestroy = !!options.autoDestroy; // has it been destroyed

  this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

  this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;

  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');
  if (!(this instanceof Readable)) return new Readable(options); // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex;
  this._readableState = new ReadableState(options, this, isDuplex); // legacy

  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }

    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;

Readable.prototype._destroy = function (err, cb) {
  cb(err);
}; // Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.


Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;

      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }

      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
}; // Unshift should *always* be something directly out of read()


Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  debug('readableAddChunk', chunk);
  var state = stream._readableState;

  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);

    if (er) {
      errorOrDestroy(stream, er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state.destroyed) {
        return false;
      } else {
        state.reading = false;

        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
      maybeReadMore(stream, state);
    }
  } // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.


  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    state.awaitDrain = 0;
    stream.emit('data', chunk);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }

  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;

  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
  }

  return er;
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
}; // backwards compatibility.


Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  var decoder = new StringDecoder(enc);
  this._readableState.decoder = decoder; // If setEncoding(null), decoder.encoding equals utf8

  this._readableState.encoding = this._readableState.decoder.encoding; // Iterate over current buffer to convert already stored Buffers:

  var p = this._readableState.buffer.head;
  var content = '';

  while (p !== null) {
    content += decoder.write(p.data);
    p = p.next;
  }

  this._readableState.buffer.clear();

  if (content !== '') this._readableState.buffer.push(content);
  this._readableState.length = content.length;
  return this;
}; // Don't raise the hwm > 1GB


var MAX_HWM = 0x40000000;

function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }

  return n;
} // This function is designed to be inlinable, so please take care when making
// changes to the function body.


function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;

  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  } // If we're asking for more than the current hwm, then raise the hwm.


  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n; // Don't have enough

  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }

  return state.length;
} // you can override either this method, or the async _read(n) below.


Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.

  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  } // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.
  // if we need a readable event, then we need to do some reading.


  var doRead = state.needReadable;
  debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  } // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.


  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true; // if the length is currently zero, then we *need* a readable event.

    if (state.length === 0) state.needReadable = true; // call internal read method

    this._read(state.highWaterMark);

    state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.

    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark;
    n = 0;
  } else {
    state.length -= n;
    state.awaitDrain = 0;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);
  return ret;
};

function onEofChunk(stream, state) {
  debug('onEofChunk');
  if (state.ended) return;

  if (state.decoder) {
    var chunk = state.decoder.end();

    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }

  state.ended = true;

  if (state.sync) {
    // if we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call
    emitReadable(stream);
  } else {
    // emit 'readable' now to make sure it gets picked up.
    state.needReadable = false;

    if (!state.emittedReadable) {
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
} // Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.


function emitReadable(stream) {
  var state = stream._readableState;
  debug('emitReadable', state.needReadable, state.emittedReadable);
  state.needReadable = false;

  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    process.nextTick(emitReadable_, stream);
  }
}

function emitReadable_(stream) {
  var state = stream._readableState;
  debug('emitReadable_', state.destroyed, state.length, state.ended);

  if (!state.destroyed && (state.length || state.ended)) {
    stream.emit('readable');
    state.emittedReadable = false;
  } // The stream needs another readable event if
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.


  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
} // at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.


function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    var len = state.length;
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) // didn't get any data, stop spinning.
      break;
  }

  state.readingMore = false;
} // abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.


Readable.prototype._read = function (n) {
  errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;

    case 1:
      state.pipes = [state.pipes, dest];
      break;

    default:
      state.pipes.push(dest);
      break;
  }

  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);

  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');

    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  } // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.


  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;

  function cleanup() {
    debug('cleanup'); // cleanup event handlers once the pipe is broken

    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true; // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.

    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  src.on('data', ondata);

  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    debug('dest.write', ret);

    if (ret === false) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
      }

      src.pause();
    }
  } // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.


  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er);
  } // Make sure our error handler is attached before userland ones.


  prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }

  dest.once('close', onclose);

  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }

  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  } // tell the dest that it's being piped to


  dest.emit('pipe', src); // start the flow if it hasn't been started already.

  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;

    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  }; // if we're not piping anywhere, then do nothing.

  if (state.pipesCount === 0) return this; // just one destination.  most common case.

  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes; // got a match.

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  } // slow case. multiple pipe destinations.


  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, {
        hasUnpiped: false
      });
    }

    return this;
  } // try to find the right one.


  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
}; // set up data events if they are asked for
// Ensure readable listeners eventually get something


Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);
  var state = this._readableState;

  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0; // Try start flowing on next tick if stream isn't explicitly paused

    if (state.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);

      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }

  return res;
};

Readable.prototype.addListener = Readable.prototype.on;

Readable.prototype.removeListener = function (ev, fn) {
  var res = Stream.prototype.removeListener.call(this, ev, fn);

  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

Readable.prototype.removeAllListeners = function (ev) {
  var res = Stream.prototype.removeAllListeners.apply(this, arguments);

  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

function updateReadableListening(self) {
  var state = self._readableState;
  state.readableListening = self.listenerCount('readable') > 0;

  if (state.resumeScheduled && !state.paused) {
    // flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true; // crude way to check if we should resume
  } else if (self.listenerCount('data') > 0) {
    self.resume();
  }
}

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
} // pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.


Readable.prototype.resume = function () {
  var state = this._readableState;

  if (!state.flowing) {
    debug('resume'); // we flow only if there is no one listening
    // for readable, but we still have to call
    // resume()

    state.flowing = !state.readableListening;
    resume(this, state);
  }

  state.paused = false;
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  debug('resume', state.reading);

  if (!state.reading) {
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);

  if (this._readableState.flowing !== false) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }

  this._readableState.paused = true;
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);

  while (state.flowing && stream.read() !== null) {
    ;
  }
} // wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.


Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');

    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);

    if (!ret) {
      paused = true;
      stream.pause();
    }
  }); // proxy all the other methods.
  // important when wrapping filters and duplexes.

  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function methodWrap(method) {
        return function methodWrapReturnFunction() {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  } // proxy certain important events.


  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  } // when we try to consume some more bytes, simply unpause the
  // underlying stream.


  this._read = function (n) {
    debug('wrapped _read', n);

    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

if (typeof Symbol === 'function') {
  Readable.prototype[Symbol.asyncIterator] = function () {
    if (createReadableStreamAsyncIterator === undefined) {
      createReadableStreamAsyncIterator = require('./internal/streams/async_iterator');
    }

    return createReadableStreamAsyncIterator(this);
  };
}

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});
Object.defineProperty(Readable.prototype, 'readableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState && this._readableState.buffer;
  }
});
Object.defineProperty(Readable.prototype, 'readableFlowing', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.flowing;
  },
  set: function set(state) {
    if (this._readableState) {
      this._readableState.flowing = state;
    }
  }
}); // exposed for testing purposes only.

Readable._fromList = fromList;
Object.defineProperty(Readable.prototype, 'readableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.length;
  }
}); // Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.

function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;
  debug('endReadable', state.endEmitted);

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  debug('endReadableNT', state.endEmitted, state.length); // Check that we didn't get one last unshift.

  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');

    if (state.autoDestroy) {
      // In case of duplex streams we need a way to detect
      // if the writable side is ready for autoDestroy as well
      var wState = stream._writableState;

      if (!wState || wState.autoDestroy && wState.finished) {
        stream.destroy();
      }
    }
  }
}

if (typeof Symbol === 'function') {
  Readable.from = function (iterable, opts) {
    if (from === undefined) {
      from = require('./internal/streams/from');
    }

    return from(Readable, iterable, opts);
  };
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }

  return -1;
}
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../errors":39,"./_stream_duplex":40,"./internal/streams/async_iterator":45,"./internal/streams/buffer_list":46,"./internal/streams/destroy":47,"./internal/streams/from":49,"./internal/streams/state":51,"./internal/streams/stream":52,"_process":28,"buffer":5,"events":10,"inherits":25,"string_decoder/":54,"util":2}],43:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.
'use strict';

module.exports = Transform;

var _require$codes = require('../errors').codes,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
    ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,
    ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;

var Duplex = require('./_stream_duplex');

require('inherits')(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;

  if (cb === null) {
    return this.emit('error', new ERR_MULTIPLE_CALLBACK());
  }

  ts.writechunk = null;
  ts.writecb = null;
  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;

  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  Duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }; // start out asking for a readable event once data is transformed.

  this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.

  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  } // When the writable side finishes, then flush out anything remaining.


  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function' && !this._readableState.destroyed) {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
}; // This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.


Transform.prototype._transform = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;

  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
}; // Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.


Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && !ts.transforming) {
    ts.transforming = true;

    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data); // TODO(BridgeAR): Write a test for these two error cases
  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided

  if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
  if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
  return stream.push(null);
}
},{"../errors":39,"./_stream_duplex":40,"inherits":25}],44:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.
'use strict';

module.exports = Writable;
/* <replacement> */

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
} // It seems a linked list but it is not
// there will be only 2 of these for each stream


function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/


var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;
/*<replacement>*/

var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/

var Stream = require('./internal/streams/stream');
/*</replacement>*/


var Buffer = require('buffer').Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

var destroyImpl = require('./internal/streams/destroy');

var _require = require('./internal/streams/state'),
    getHighWaterMark = _require.getHighWaterMark;

var _require$codes = require('../errors').codes,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
    ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
    ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
    ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END,
    ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;

var errorOrDestroy = destroyImpl.errorOrDestroy;

require('inherits')(Writable, Stream);

function nop() {}

function WritableState(options, stream, isDuplex) {
  Duplex = Duplex || require('./_stream_duplex');
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream,
  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag to indicate whether or not this stream
  // contains buffers or objects.

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()

  this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex); // if _final has been called

  this.finalCalled = false; // drain event flag.

  this.needDrain = false; // at the start of calling end()

  this.ending = false; // when end() has been called, and returned

  this.ended = false; // when 'finish' is emitted

  this.finished = false; // has it been destroyed

  this.destroyed = false; // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.

  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.

  this.length = 0; // a flag to see when we're in the middle of a write.

  this.writing = false; // when true all writes will be buffered until .uncork() call

  this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.

  this.sync = true; // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.

  this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

  this.onwrite = function (er) {
    onwrite(stream, er);
  }; // the callback that the user supplies to write(chunk,encoding,cb)


  this.writecb = null; // the amount that is being written when _write is called.

  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted

  this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams

  this.prefinished = false; // True if the error was already emitted and should not be thrown again

  this.errorEmitted = false; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'finish' (and potentially 'end')

  this.autoDestroy = !!options.autoDestroy; // count buffered requests

  this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two

  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];

  while (current) {
    out.push(current);
    current = current.next;
  }

  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function writableStateBufferGetter() {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})(); // Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.


var realHasInstance;

if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex'); // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.
  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the WritableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex;
  if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
  this._writableState = new WritableState(options, this, isDuplex); // legacy.

  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
} // Otherwise people can pipe Writable streams, which is just wrong.


Writable.prototype.pipe = function () {
  errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
};

function writeAfterEnd(stream, cb) {
  var er = new ERR_STREAM_WRITE_AFTER_END(); // TODO: defer error events consistently everywhere, not just the cb

  errorOrDestroy(stream, er);
  process.nextTick(cb, er);
} // Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.


function validChunk(stream, state, chunk, cb) {
  var er;

  if (chunk === null) {
    er = new ERR_STREAM_NULL_VALUES();
  } else if (typeof chunk !== 'string' && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk);
  }

  if (er) {
    errorOrDestroy(stream, er);
    process.nextTick(cb, er);
    return false;
  }

  return true;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ending) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};

Writable.prototype.cork = function () {
  this._writableState.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

Object.defineProperty(Writable.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }

  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
}); // if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.

function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);

    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }

  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };

    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }

    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'));else if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    process.nextTick(cb, er); // this can emit finish, and it will always happen
    // after error

    process.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    errorOrDestroy(stream, er); // this can emit finish, but finish must
    // always follow error

    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK();
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state) || stream.destroyed;

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      process.nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
} // Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.


function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
} // if there's something in the buffer waiting, then process it


function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;

    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }

    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite

    state.pendingcb++;
    state.lastBufferedRequest = null;

    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }

    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.

      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

  if (state.corked) {
    state.corked = 1;
    this.uncork();
  } // ignore unnecessary end() calls.


  if (!state.ending) endWritable(this, state, cb);
  return this;
};

Object.defineProperty(Writable.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;

    if (err) {
      errorOrDestroy(stream, err);
    }

    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}

function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function' && !state.destroyed) {
      state.pendingcb++;
      state.finalCalled = true;
      process.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);

  if (need) {
    prefinish(stream, state);

    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');

      if (state.autoDestroy) {
        // In case of duplex streams we need a way to detect
        // if the readable side is ready for autoDestroy as well
        var rState = stream._readableState;

        if (!rState || rState.autoDestroy && rState.endEmitted) {
          stream.destroy();
        }
      }
    }
  }

  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);

  if (cb) {
    if (state.finished) process.nextTick(cb);else stream.once('finish', cb);
  }

  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;

  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  } // reuse the free corkReq.


  state.corkedRequestsFree.next = corkReq;
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }

    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._writableState.destroyed = value;
  }
});
Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;

Writable.prototype._destroy = function (err, cb) {
  cb(err);
};
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../errors":39,"./_stream_duplex":40,"./internal/streams/destroy":47,"./internal/streams/state":51,"./internal/streams/stream":52,"_process":28,"buffer":5,"inherits":25,"util-deprecate":58}],45:[function(require,module,exports){
(function (process){
'use strict';

var _Object$setPrototypeO;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var finished = require('./end-of-stream');

var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');

function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}

function readAndResolve(iter) {
  var resolve = iter[kLastResolve];

  if (resolve !== null) {
    var data = iter[kStream].read(); // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'

    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}

function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}

function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }

      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}

var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },

  next: function next() {
    var _this = this;

    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];

    if (error !== null) {
      return Promise.reject(error);
    }

    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }

    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    } // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time


    var lastPromise = this[kLastPromise];
    var promise;

    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();

      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }

      promise = new Promise(this[kHandlePromise]);
    }

    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this;

  // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to
  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);

var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;

  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();

      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  finished(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject]; // reject if we are waiting for data in the Promise
      // returned by next() and store the error

      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }

      iterator[kError] = err;
      return;
    }

    var resolve = iterator[kLastResolve];

    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }

    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};

module.exports = createReadableStreamAsyncIterator;
}).call(this,require('_process'))
},{"./end-of-stream":48,"_process":28}],46:[function(require,module,exports){
'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('buffer'),
    Buffer = _require.Buffer;

var _require2 = require('util'),
    inspect = _require2.inspect;

var custom = inspect && inspect.custom || 'inspect';

function copyBuffer(src, target, offset) {
  Buffer.prototype.copy.call(src, target, offset);
}

module.exports =
/*#__PURE__*/
function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  _createClass(BufferList, [{
    key: "push",
    value: function push(v) {
      var entry = {
        data: v,
        next: null
      };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    }
  }, {
    key: "unshift",
    value: function unshift(v) {
      var entry = {
        data: v,
        next: this.head
      };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
      this.length = 0;
    }
  }, {
    key: "join",
    value: function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;

      while (p = p.next) {
        ret += s + p.data;
      }

      return ret;
    }
  }, {
    key: "concat",
    value: function concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      var ret = Buffer.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;

      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }

      return ret;
    } // Consumes a specified amount of bytes or characters from the buffered data.

  }, {
    key: "consume",
    value: function consume(n, hasStrings) {
      var ret;

      if (n < this.head.data.length) {
        // `slice` is the same for buffers and strings.
        ret = this.head.data.slice(0, n);
        this.head.data = this.head.data.slice(n);
      } else if (n === this.head.data.length) {
        // First chunk is a perfect match.
        ret = this.shift();
      } else {
        // Result spans more than one buffer.
        ret = hasStrings ? this._getString(n) : this._getBuffer(n);
      }

      return ret;
    }
  }, {
    key: "first",
    value: function first() {
      return this.head.data;
    } // Consumes a specified amount of characters from the buffered data.

  }, {
    key: "_getString",
    value: function _getString(n) {
      var p = this.head;
      var c = 1;
      var ret = p.data;
      n -= ret.length;

      while (p = p.next) {
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;else ret += str.slice(0, n);
        n -= nb;

        if (n === 0) {
          if (nb === str.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = str.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Consumes a specified amount of bytes from the buffered data.

  }, {
    key: "_getBuffer",
    value: function _getBuffer(n) {
      var ret = Buffer.allocUnsafe(n);
      var p = this.head;
      var c = 1;
      p.data.copy(ret);
      n -= p.data.length;

      while (p = p.next) {
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;

        if (n === 0) {
          if (nb === buf.length) {
            ++c;
            if (p.next) this.head = p.next;else this.head = this.tail = null;
          } else {
            this.head = p;
            p.data = buf.slice(nb);
          }

          break;
        }

        ++c;
      }

      this.length -= c;
      return ret;
    } // Make sure the linked list only shows the minimal necessary information.

  }, {
    key: custom,
    value: function value(_, options) {
      return inspect(this, _objectSpread({}, options, {
        // Only inspect one level.
        depth: 0,
        // It should not recurse.
        customInspect: false
      }));
    }
  }]);

  return BufferList;
}();
},{"buffer":5,"util":2}],47:[function(require,module,exports){
(function (process){
'use strict'; // undocumented cb() API, needed for core, not for public API

function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        process.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorNT, this, err);
      }
    }

    return this;
  } // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks


  if (this._readableState) {
    this._readableState.destroyed = true;
  } // if this is a duplex stream mark the writable part as destroyed as well


  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        process.nextTick(emitErrorAndCloseNT, _this, err);
      } else {
        process.nextTick(emitCloseNT, _this);
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, _this);
    }
  });

  return this;
}

function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}

function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

function errorOrDestroy(stream, err) {
  // We have tests that rely on errors being emitted
  // in the same tick, so changing this is semver major.
  // For now when you opt-in to autoDestroy we allow
  // the error to be emitted nextTick. In a future
  // semver major update we should change the default to this.
  var rState = stream._readableState;
  var wState = stream._writableState;
  if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream.destroy(err);else stream.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy,
  errorOrDestroy: errorOrDestroy
};
}).call(this,require('_process'))
},{"_process":28}],48:[function(require,module,exports){
// Ported from https://github.com/mafintosh/end-of-stream with
// permission from the author, Mathias Buus (@mafintosh).
'use strict';

var ERR_STREAM_PREMATURE_CLOSE = require('../../../errors').codes.ERR_STREAM_PREMATURE_CLOSE;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    callback.apply(this, args);
  };
}

function noop() {}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function eos(stream, opts, callback) {
  if (typeof opts === 'function') return eos(stream, null, opts);
  if (!opts) opts = {};
  callback = once(callback || noop);
  var readable = opts.readable || opts.readable !== false && stream.readable;
  var writable = opts.writable || opts.writable !== false && stream.writable;

  var onlegacyfinish = function onlegacyfinish() {
    if (!stream.writable) onfinish();
  };

  var writableEnded = stream._writableState && stream._writableState.finished;

  var onfinish = function onfinish() {
    writable = false;
    writableEnded = true;
    if (!readable) callback.call(stream);
  };

  var readableEnded = stream._readableState && stream._readableState.endEmitted;

  var onend = function onend() {
    readable = false;
    readableEnded = true;
    if (!writable) callback.call(stream);
  };

  var onerror = function onerror(err) {
    callback.call(stream, err);
  };

  var onclose = function onclose() {
    var err;

    if (readable && !readableEnded) {
      if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }

    if (writable && !writableEnded) {
      if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
  };

  var onrequest = function onrequest() {
    stream.req.on('finish', onfinish);
  };

  if (isRequest(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    if (stream.req) onrequest();else stream.on('request', onrequest);
  } else if (writable && !stream._writableState) {
    // legacy streams
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }

  stream.on('end', onend);
  stream.on('finish', onfinish);
  if (opts.error !== false) stream.on('error', onerror);
  stream.on('close', onclose);
  return function () {
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    if (stream.req) stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
}

module.exports = eos;
},{"../../../errors":39}],49:[function(require,module,exports){
module.exports = function () {
  throw new Error('Readable.from is not available in the browser')
};

},{}],50:[function(require,module,exports){
// Ported from https://github.com/mafintosh/pump with
// permission from the author, Mathias Buus (@mafintosh).
'use strict';

var eos;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(void 0, arguments);
  };
}

var _require$codes = require('../../../errors').codes,
    ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;

function noop(err) {
  // Rethrow the error if it exists to avoid swallowing it
  if (err) throw err;
}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function destroyer(stream, reading, writing, callback) {
  callback = once(callback);
  var closed = false;
  stream.on('close', function () {
    closed = true;
  });
  if (eos === undefined) eos = require('./end-of-stream');
  eos(stream, {
    readable: reading,
    writable: writing
  }, function (err) {
    if (err) return callback(err);
    closed = true;
    callback();
  });
  var destroyed = false;
  return function (err) {
    if (closed) return;
    if (destroyed) return;
    destroyed = true; // request.destroy just do .end - .abort is what we want

    if (isRequest(stream)) return stream.abort();
    if (typeof stream.destroy === 'function') return stream.destroy();
    callback(err || new ERR_STREAM_DESTROYED('pipe'));
  };
}

function call(fn) {
  fn();
}

function pipe(from, to) {
  return from.pipe(to);
}

function popCallback(streams) {
  if (!streams.length) return noop;
  if (typeof streams[streams.length - 1] !== 'function') return noop;
  return streams.pop();
}

function pipeline() {
  for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }

  var callback = popCallback(streams);
  if (Array.isArray(streams[0])) streams = streams[0];

  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams');
  }

  var error;
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return;
      destroys.forEach(call);
      callback(error);
    });
  });
  return streams.reduce(pipe);
}

module.exports = pipeline;
},{"../../../errors":39,"./end-of-stream":48}],51:[function(require,module,exports){
'use strict';

var ERR_INVALID_OPT_VALUE = require('../../../errors').codes.ERR_INVALID_OPT_VALUE;

function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}

function getHighWaterMark(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);

  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }

    return Math.floor(hwm);
  } // Default value


  return state.objectMode ? 16 : 16 * 1024;
}

module.exports = {
  getHighWaterMark: getHighWaterMark
};
},{"../../../errors":39}],52:[function(require,module,exports){
module.exports = require('events').EventEmitter;

},{"events":10}],53:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');
exports.finished = require('./lib/internal/streams/end-of-stream.js');
exports.pipeline = require('./lib/internal/streams/pipeline.js');

},{"./lib/_stream_duplex.js":40,"./lib/_stream_passthrough.js":41,"./lib/_stream_readable.js":42,"./lib/_stream_transform.js":43,"./lib/_stream_writable.js":44,"./lib/internal/streams/end-of-stream.js":48,"./lib/internal/streams/pipeline.js":50}],54:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"safe-buffer":34}],55:[function(require,module,exports){
(function (global){
'use strict';

var required = require('requires-port')
  , qs = require('querystringify')
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i
  , whitespace = '[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]'
  , left = new RegExp('^'+ whitespace +'+');

/**
 * Trim a given string.
 *
 * @param {String} str String to trim.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(left, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address) {          // Sanitize what is left of the address
    return address.replace('\\', '/');
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof global !== 'undefined') globalVar = global;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address) {
  address = trimLeft(address);
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  address = trimLeft(address);

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[3] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;

module.exports = Url;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"querystringify":32,"requires-port":33}],56:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":57,"punycode":3,"querystring":31}],57:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],58:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],59:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],60:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],61:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":60,"_process":28,"inherits":59}],62:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],63:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const faunadb_1 = require("faunadb");
const BiotaFactory = require("~/factory");
const page_1 = require("./page");
Object.assign(window, { Biota: db_1.DB, BiotaQ: faunadb_1.query, BiotaFactory, BiotaPage: page_1.Page });
Object.assign(global, { Biota: db_1.DB, BiotaQ: faunadb_1.query, BiotaFactory, BiotaPage: page_1.Page });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./db":65,"./page":154,"faunadb":11,"~/factory":80}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIMPLE_SEPARATOR = "_";
exports.DOUBLE_SEPARATOR = "__";
exports.TS_2500_YEARS = 31556952 * 1000 * 530;
exports.CONVENTION = {
    ROLE_PREFIX: "biota.",
    INDEX_PREFIX: "biota.",
    COLLECTION_PREFIX: "biota.",
    UDFUNCTION_PREFIX: "biota."
};

},{}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const fauna = require("faunadb");
const framework = require("~/framework");
const tasks_1 = require("~/tasks");
function bindThis(self, rootKey) {
    const resolver = value => {
        let entries = Object.entries(value);
        for (let [key, entry] of entries) {
            if (typeof entry === "object") {
                value[key] = resolver(entry);
            }
            else if (typeof entry === "function") {
                value[key] = entry.bind(self);
            }
            else {
                value[key] = entry;
            }
        }
        return value;
    };
    resolver(self[rootKey] || {});
}
class DB {
    constructor(options) {
        let { secret, debug } = options || {};
        const log = debug_1.default("biota");
        log.enabled = debug;
        this.client = new fauna.Client({ secret });
        this.query = framework.query.bind(this);
        this.paginate = framework.paginate.bind(this);
        this.login = framework.login.bind(this);
        this.relation = framework.relation.bind(this);
        this.execute = tasks_1.execute.bind(this);
        this.foundation = framework.foundation.bind(this);
        this.collection = framework.collection.bind(this);
        this.framework = framework;
        bindThis(this, "framework");
    }
}
exports.DB = DB;

},{"debug":8,"faunadb":11,"~/framework":152,"~/tasks":155}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const ql_1 = require("~/factory/api/ql");
function collection(name = undefined) {
    if (!name) {
        throw new Error(`biota.collection(name) - valid name is required`);
    }
    return {
        /**
         * Specific methods
         */
        login(id, password) {
            return faunadb_1.query.Login(ql_1.Reference({ collection: name, id }), {
                password
            });
        },
        changePassword(password, id = faunadb_1.query.Identity()) {
            return faunadb_1.query.Call("biota.ChangePassword", [ql_1.Identity(), id, password]);
        },
        /**
         * General methods
         */
        get(id) {
            return faunadb_1.query.Get(faunadb_1.query.Ref(faunadb_1.query.Collection(name), id));
        },
        insert(data, { id, password, credentials } = {}) {
            return faunadb_1.query.Call("biota.Insert", [
                ql_1.Identity(),
                ql_1.Reference({ collection: name, id }),
                { data, credentials: { ...credentials, password } }
            ]);
        },
        update(id, data) {
            return faunadb_1.query.Call("biota.Update", [
                ql_1.Identity(),
                ql_1.Reference({ collection: name, id }),
                { data }
            ]);
        },
        replace(id, data) {
            return faunadb_1.query.Call("biota.Replace", [
                ql_1.Identity(),
                ql_1.Reference({ collection: name, id }),
                { data }
            ]);
        },
        upsert(id, data) {
            return faunadb_1.query.If(faunadb_1.query.Exists(ql_1.Reference({ collection: name, id })), collection(name).update(id, data), collection(name).insert(data, { id }));
        },
        repsert(id, data) {
            return faunadb_1.query.If(faunadb_1.query.Exists(ql_1.Reference({ collection: name, id })), collection(name).replace(id, data), collection(name).insert(data, { id }));
        },
        delete(id) {
            return faunadb_1.query.Call("biota.Delete", [
                ql_1.Identity(),
                ql_1.Reference({ collection: name, id })
            ]);
        },
        forget(id) {
            return faunadb_1.query.Call("biota.Forget", [
                ql_1.Identity(),
                ql_1.Reference({ collection: name, id })
            ]);
        }
    };
}
exports.collection = collection;

},{"faunadb":11,"~/factory/api/ql":70}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const ql_1 = require("~/factory/api/ql");
const helpers_1 = require("~/helpers");
// relative
const database_1 = require("~/factory/classes/database");
const collection_1 = require("~/factory/classes/collection");
const udfunction_1 = require("~/factory/classes/udfunction");
const index_1 = require("~/factory/classes/index");
const role_1 = require("~/factory/classes/role");
exports.create = {
    document: function documentCreate(collectionName, options = {}) {
        return faunadb_1.query.Create(ql_1.Reference({ collection: collectionName, id: options.id }), options);
    },
    database: function databaseCreate(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.CreateDatabase(database_1.Database(definition));
    },
    collection: function collectionCreate(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.CreateCollection(collection_1.Collection(definition));
    },
    index: function indexCreate(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.CreateIndex(index_1.Index(definition));
    },
    function: function functionCreate(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.CreateFunction(udfunction_1.UDFunction(definition));
    },
    role: function roleCreate(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.CreateRole(role_1.Role(definition));
    },
    token: function tokenCreate(ref, options = {}) {
        return faunadb_1.query.Create(faunadb_1.query.Tokens(), { instance: ref, ...options });
    },
    key: function keyCreate(options) {
        return faunadb_1.query.CreateKey(options);
    }
};

},{"faunadb":11,"~/factory/api/ql":70,"~/factory/classes/collection":75,"~/factory/classes/database":76,"~/factory/classes/index":77,"~/factory/classes/role":78,"~/factory/classes/udfunction":79,"~/helpers":153}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
exports.forget = {
    database: function databaseForget(name) {
        return faunadb_1.query.Delete(faunadb_1.query.Database(name));
    },
    collection: function collectionForget(name) {
        return faunadb_1.query.Delete(faunadb_1.query.Collection(name));
    },
    index: function indexForget(name) {
        return faunadb_1.query.Delete(faunadb_1.query.Index(name));
    },
    function: function functionForget(name) {
        return faunadb_1.query.Delete(faunadb_1.query.Function(name));
    },
    role: function roleForget(name) {
        return faunadb_1.query.Delete(faunadb_1.query.Role(name));
    },
    token: function tokenForget(id) {
        return faunadb_1.query.Delete(faunadb_1.query.Ref(faunadb_1.query.Tokens(), id));
    },
    key: function keyForget(id) {
        return faunadb_1.query.Delete(faunadb_1.query.Ref(faunadb_1.query.Keys(), id));
    }
};

},{"faunadb":11}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
exports.get = {
    get: function documentGet(ref) {
        return faunadb_1.query.Get(ref);
    },
    collections: function collectionsGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Collections(), {});
    },
    indexes: function indexesGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Indexes(), {});
    },
    functions: function functionsGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Functions(), {});
    },
    roles: function rolesGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Roles(), {});
    },
    keys: function keysGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Keys());
    },
    tokens: function keysGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Documents(faunadb_1.query.Tokens()));
    },
    credentials: function credentialsGet() {
        return faunadb_1.query.Paginate(faunadb_1.query.Documents(faunadb_1.query.Credentials()));
    }
};

},{"faunadb":11}],70:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("../ql/batch"));
__export(require("../ql/reference"));
__export(require("../ql/identity"));
__export(require("../ql/string_split"));

},{"../ql/batch":81,"../ql/identity":82,"../ql/reference":83,"../ql/string_split":84}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
// import { DB } from "~/db";
exports.replace = {
    database: function databaseReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Database(name), options);
    },
    collection: function collectionReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Collection(name), options);
    },
    index: function indexReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Index(name), options);
    },
    function: function fuctionReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Function(name), options);
    },
    role: function roleReplace(name, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Role(name), options);
    },
    token: function tokenReplace(id, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Ref(faunadb_1.query.Tokens(), id), options);
    },
    key: function keyReplace(id, options) {
        return faunadb_1.query.Replace(faunadb_1.query.Ref(faunadb_1.query.Keys(), id), options);
    }
};

},{"faunadb":11}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const helpers_1 = require("~/helpers");
const create_1 = require("~/factory/api/create");
const replace_1 = require("~/factory/api/replace");
exports.repsert = {
    database: function databaseReplace(name, options) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Database(definition.name)), replace_1.replace.database(definition.name, definition), create_1.create.database(definition.name, definition));
    },
    collection: function collectionReplace(name, options) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Collection(definition.name)), replace_1.replace.collection(definition.name, definition), create_1.create.collection(definition.name, definition));
    },
    index: function indexReplace(name, options) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Index(definition.name)), replace_1.replace.index(definition.name, definition), create_1.create.index(definition.name, definition));
    },
    function: function fuctionReplace(name, options) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Function(definition.name)), replace_1.replace.function(definition.name, definition), create_1.create.function(definition.name, definition));
    },
    role: function roleReplace(name, options) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Role(definition.name)), replace_1.replace.role(definition.name, definition), create_1.create.role(definition.name, definition));
    },
    token: function tokenReplace(id, options) {
        let definition = helpers_1.nameOrOptions(id, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Ref(faunadb_1.query.Tokens(), definition.name)), replace_1.replace.token(definition.name, definition), create_1.create.token(definition.name, definition));
    },
    key: function keyReplace(id, options) {
        let definition = helpers_1.nameOrOptions(id, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Ref(faunadb_1.query.Keys(), definition.name)), replace_1.replace.key(definition.name, definition), create_1.create.key(definition));
    }
};

},{"faunadb":11,"~/factory/api/create":67,"~/factory/api/replace":71,"~/helpers":153}],73:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const helpers_1 = require("~/helpers");
exports.update = {
    database: function databaseUpdate(name, options) {
        return faunadb_1.query.Update(faunadb_1.query.Database(name), options);
    },
    collection: function collectionUpdate(name, options) {
        return faunadb_1.query.Update(faunadb_1.query.Collection(name), options);
    },
    index: function indexUpdate(name, options = {}) {
        let { unique } = options;
        return faunadb_1.query.Update(faunadb_1.query.Index(name), { name, unique });
    },
    function: function functionUpdate(name, options) {
        return faunadb_1.query.Update(faunadb_1.query.Function(name), options);
    },
    role: function roleUpdate(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        let membership = definition.membership || [];
        if (!Array.isArray(membership))
            membership = [membership];
        let privileges = definition.privileges || [];
        return faunadb_1.query.Let({
            role: faunadb_1.query.Get(faunadb_1.query.Role(definition.name)),
            memberships: faunadb_1.query.Select("membership", faunadb_1.query.Var("role"), []),
            privileges: faunadb_1.query.Select("privileges", faunadb_1.query.Var("role"), []),
            membershipArray: faunadb_1.query.If(faunadb_1.query.IsArray(faunadb_1.query.Var("memberships")), faunadb_1.query.Var("memberships"), [faunadb_1.query.Var("memberships")]),
            differencedPrivileges: faunadb_1.query.Filter(faunadb_1.query.Var("privileges"), faunadb_1.query.Lambda("privilege", faunadb_1.query.Let({
                checks: faunadb_1.query.Map(privileges, faunadb_1.query.Lambda("newPrivilege", faunadb_1.query.Not(faunadb_1.query.Equals(faunadb_1.query.Select("resource", faunadb_1.query.Var("privilege"), -1), faunadb_1.query.Select("resource", faunadb_1.query.Var("newPrivilege"), -1)))))
            }, faunadb_1.query.If(faunadb_1.query.IsEmpty(faunadb_1.query.Var("checks")), true, faunadb_1.query.And(faunadb_1.query.Var("checks")))))),
            filteredPrivileges: faunadb_1.query.Filter(faunadb_1.query.Var("differencedPrivileges"), faunadb_1.query.Lambda("privilege", faunadb_1.query.Let({
                resource: faunadb_1.query.Select("resource", faunadb_1.query.Var("privilege"), false)
            }, faunadb_1.query.If(faunadb_1.query.IsRef(faunadb_1.query.Var("resource")), faunadb_1.query.Exists(faunadb_1.query.Var("resource")), false)))),
            differencedMembership: faunadb_1.query.Filter(faunadb_1.query.Var("membershipArray"), faunadb_1.query.Lambda("membership", faunadb_1.query.Let({
                checks: faunadb_1.query.Map(membership, faunadb_1.query.Lambda("newMembership", faunadb_1.query.Not(faunadb_1.query.Equals(faunadb_1.query.Select("resource", faunadb_1.query.Var("membership"), -1), faunadb_1.query.Select("resource", faunadb_1.query.Var("newMembership"), -1)))))
            }, faunadb_1.query.If(faunadb_1.query.IsEmpty(faunadb_1.query.Var("checks")), true, faunadb_1.query.And(faunadb_1.query.Var("checks")))))),
            filteredMembership: faunadb_1.query.Filter(faunadb_1.query.Var("differencedMembership"), faunadb_1.query.Lambda("membership", faunadb_1.query.Let({
                resource: faunadb_1.query.Select("resource", faunadb_1.query.Var("membership"), false)
            }, faunadb_1.query.If(faunadb_1.query.IsRef(faunadb_1.query.Var("resource")), faunadb_1.query.Exists(faunadb_1.query.Var("resource")), false))))
        }, faunadb_1.query.Distinct(faunadb_1.query.Union(faunadb_1.query.Var("filteredPrivileges"), privileges))
        // q.Update(q.Role(definition.name), {
        //   name: definition.name,
        //   membership: q.Distinct(
        //     q.Union(q.Var("filteredMembership"), membership)
        //   ),
        //   privileges: q.Distinct(q.Union(q.Var("filteredPrivileges"), privileges))
        // })
        );
    },
    token: function tokenUpdate(id, options) {
        return faunadb_1.query.Update(faunadb_1.query.Ref(faunadb_1.query.Tokens(), id), options);
    },
    key: function keyUpdate(id, options) {
        return faunadb_1.query.Update(faunadb_1.query.Ref(faunadb_1.query.Keys(), id), options);
    }
};

},{"faunadb":11,"~/helpers":153}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const helpers_1 = require("~/helpers");
const create_1 = require("~/factory/api/create");
const update_1 = require("~/factory/api/update");
exports.upsert = {
    database: function databaseUpsert(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Database(definition.name)), update_1.update.database(definition.name, definition), create_1.create.database(definition.name, definition));
    },
    collection: function collectionUpsert(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Collection(definition.name)), update_1.update.collection(definition.name, definition), create_1.create.collection(definition.name, definition));
    },
    index: function indexUpsert(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Index(definition.name)), update_1.update.index(definition.name, definition), create_1.create.index(definition.name, definition));
    },
    function: function functionUpsert(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Function(definition.name)), update_1.update.function(definition.name, definition), create_1.create.function(definition.name, definition));
    },
    role: function roleUpsert(name, options = {}) {
        let definition = helpers_1.nameOrOptions(name, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Role(definition.name)), update_1.update.role(definition.name, definition), create_1.create.role(definition.name, definition));
    },
    token: function tokenUpsert(id, options = {}) {
        let definition = helpers_1.nameOrOptions(id, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Ref(faunadb_1.query.Tokens(), definition.name)), update_1.update.token(definition.name, definition), create_1.create.token(definition.name, definition));
    },
    key: function keyUpsert(id, options = {}) {
        let definition = helpers_1.nameOrOptions(id, options);
        return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Ref(faunadb_1.query.Keys(), definition.name)), update_1.update.key(definition.name, definition), create_1.create.key(definition));
    }
};

},{"faunadb":11,"~/factory/api/create":67,"~/factory/api/update":73,"~/helpers":153}],75:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// biota
const consts_1 = require("~/consts");
function collectionNameNormalized(name) {
    return `${consts_1.CONVENTION.COLLECTION_PREFIX}${collectionNamePlural(name.replace(consts_1.CONVENTION.COLLECTION_PREFIX, ""))}`;
}
exports.collectionNameNormalized = collectionNameNormalized;
function collectionNameSingular(name) {
    return name.endsWith("s") ? name.slice(-1) : name;
}
exports.collectionNameSingular = collectionNameSingular;
function collectionNamePlural(name) {
    return !name.endsWith("s") ? name + "s" : name;
}
exports.collectionNamePlural = collectionNamePlural;
function Collection(collection) {
    let { name, data, history_days, ttl_days } = collection || {};
    return {
        name,
        data,
        history_days,
        ttl_days
    };
}
exports.Collection = Collection;

},{"~/consts":64}],76:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Database(database) {
    let { name, data = {}, api_version } = database || {};
    let self = {
        name,
        data,
        api_version
    };
    return self;
}
exports.Database = Database;

},{}],77:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
function indexNameNormalized(name) {
    return `biota.${name.replace("biota.", "")}`;
}
exports.indexNameNormalized = indexNameNormalized;
function Index(index) {
    let { name, source = {
        collection: undefined,
        fields: {}
    }, terms = [], values = [], unique = false, serialized = true, permissions = {}, data = {} } = index || {};
    let self = {
        name,
        source,
        terms,
        values,
        unique,
        serialized,
        permissions,
        data
    };
    return self;
}
exports.Index = Index;
function Cursor(pathArray) {
    return faunadb_1.query.Query(faunadb_1.query.Lambda("doc", faunadb_1.query.Select(pathArray, faunadb_1.query.Var("doc"), Infinity)));
}
exports.Cursor = Cursor;
function ToCursor(index) {
    const { name, source = {}, terms = [] } = index || {};
    let pathArray;
    try {
        pathArray = terms[0].field;
    }
    catch (error) {
        pathArray = undefined;
    }
    if (pathArray) {
        return {
            name,
            source: {
                ...source,
                fields: {
                    cursor: Cursor(pathArray)
                }
            },
            values: [{ binding: "cursor" }, { field: ["ref"] }]
        };
    }
    else {
        return undefined;
    }
}
exports.ToCursor = ToCursor;
function ToReverse(index) {
    let { terms, data } = index || {};
    let [firstTerm = {}, ...otherTerms] = terms || [];
    firstTerm.reverse = true;
    return {
        ...index,
        name: `${index.name}__reverse`,
        terms: [firstTerm, ...otherTerms],
        data: { ...data, reverse: true }
    };
}
exports.ToReverse = ToReverse;
function NGramOnField(depth = 10, field) {
    return faunadb_1.query.Union(faunadb_1.query.Map(new Array(depth).fill(null).map((_, i) => i + 1), faunadb_1.query.Lambda("min", faunadb_1.query.NGram(faunadb_1.query.LowerCase(faunadb_1.query.Select(field, faunadb_1.query.Var("instance"))), faunadb_1.query.Var("min"), faunadb_1.query.Add(1, faunadb_1.query.Var("min"))))));
}
exports.NGramOnField = NGramOnField;
function SearchIndex(collection, depth = 10, fields) {
    return Index({
        name: `${collection}__search_on__${fields
            .map(field => field.join("_"))
            .join("_and_")}`,
        source: {
            collection: faunadb_1.query.Collection(collection),
            fields: {
                search: faunadb_1.query.Query(faunadb_1.query.Lambda("instance", faunadb_1.query.Distinct(faunadb_1.query.Union(fields.map(field => NGramOnField(depth, field))))))
            }
        },
        terms: [{ binding: "search" }]
    });
}
exports.SearchIndex = SearchIndex;

},{"faunadb":11}],78:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("~/consts");
__export(require("../role/action"));
__export(require("../role/privilege"));
function roleNameNormalized(name) {
    return `${consts_1.CONVENTION.ROLE_PREFIX}${name.replace(consts_1.CONVENTION.ROLE_PREFIX, "")}`;
}
exports.roleNameNormalized = roleNameNormalized;
function Role(role) {
    let { name, membership, privileges } = role || {};
    let self = {
        name,
        membership,
        privileges: privileges || []
    };
    return self;
}
exports.Role = Role;

},{"../role/action":85,"../role/privilege":86,"~/consts":64}],79:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
// biota
const consts_1 = require("~/consts");
function udfunctionNameNormalized(name) {
    return `${consts_1.CONVENTION.UDFUNCTION_PREFIX}${name.replace(consts_1.CONVENTION.UDFUNCTION_PREFIX, "")}`;
}
exports.udfunctionNameNormalized = udfunctionNameNormalized;
function UDFunction(fn) {
    let { name = "", body, data, role } = fn || {};
    let self = {
        name,
        body,
        data,
        role
    };
    return self;
}
exports.UDFunction = UDFunction;

},{"~/consts":64}],80:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ql = require("./api/ql");
// by class
var collection_1 = require("./api/collection");
exports.collection = collection_1.collection;
// export { database } from "./api/database";
// crud
var get_1 = require("./api/get");
exports.get = get_1.get;
var create_1 = require("./api/create");
exports.create = create_1.create;
var update_1 = require("./api/update");
exports.update = update_1.update;
var upsert_1 = require("./api/upsert");
exports.upsert = upsert_1.upsert;
var repsert_1 = require("./api/repsert");
exports.repsert = repsert_1.repsert;
var replace_1 = require("./api/replace");
exports.replace = replace_1.replace;
var forget_1 = require("./api/forget");
exports.forget = forget_1.forget;

},{"./api/collection":66,"./api/create":67,"./api/forget":68,"./api/get":69,"./api/ql":70,"./api/replace":71,"./api/repsert":72,"./api/update":73,"./api/upsert":74}],81:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Batch(fqlQueries) {
    return fqlQueries;
}
exports.Batch = Batch;

},{}],82:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const fauna = require("faunadb");
const q = fauna.query;
function Identity() {
    return q.If(q.HasIdentity(), q.Identity(), null);
}
exports.Identity = Identity;

},{"faunadb":11}],83:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const fauna = require("faunadb");
const q = fauna.query;
function Reference({ collection, id, ref } = {}) {
    return ref ? ref : id ? q.Ref(q.Collection(collection), id) : q.Collection(collection);
}
exports.Reference = Reference;
function Ref(collectionOrRef, id) {
    if (typeof collectionOrRef === 'string') {
        const [collection, withId] = collectionOrRef.split('/');
        return q.Ref(q.Collection(collection), withId);
    }
    else {
        return q.Ref(collectionOrRef);
    }
}
exports.Ref = Ref;

},{"faunadb":11}],84:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// Harvested from https://github.com/shiftx/faunadb-fql-lib/blob/master/src/functions/StringSplit.ts
exports.StringSplit = (string, delimiter = ".") => faunadb_1.query.If(faunadb_1.query.Not(faunadb_1.query.IsString(string)), faunadb_1.query.Abort("SplitString only accept strings"), faunadb_1.query.Map(faunadb_1.query.FindStrRegex(string, faunadb_1.query.Concat(["[^\\", delimiter, "]+"])), faunadb_1.query.Lambda("res", faunadb_1.query.Select(["data"], faunadb_1.query.Var("res")))));

},{"faunadb":11}],85:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const fauna = require("faunadb");
const q = fauna.query;
// biota
const rule_1 = require("~/factory/rule");
const rules_1 = require("~/framework/api/default/rules");
const wrapDoc_1 = require("~/framework/helpers/wrapDoc");
function Action(type) {
    switch (type) {
        case "self":
            return rules_1.is_self;
        case "owner":
            return rules_1.is_owner;
        case "not_owner":
            return rules_1.is_not_owner;
        case "assignee":
            return rules_1.is_assignee;
        case "not_assignee":
            return rules_1.is_not_assignee;
        case "all":
            return rules_1.all;
        case "none":
            return rules_1.none;
        default:
            return false;
    }
}
exports.Action = Action;
function processActions(actions, defaultActions = []) {
    if (!actions && defaultActions.length === 0)
        return false;
    if (!Array.isArray(actions)) {
        return [actions, ...defaultActions];
    }
    else {
        return [...actions, ...defaultActions];
    }
}
function prepareRules(actions) {
    return rule_1.Rules(actions.map(action => {
        if (typeof action === "string") {
            return Action(action);
        }
        else {
            return action;
        }
    }));
}
function ReadAction(actions) {
    actions = processActions(actions);
    if (typeof actions === "boolean")
        return actions;
    return q.Lambda("ref", wrapDoc_1.wrapDoc("ref", prepareRules(actions)));
}
exports.ReadAction = ReadAction;
function WriteAction(actions) {
    actions = processActions(actions, [
    // is_activity_not_changed,
    // are_rights_not_changed
    ]);
    if (typeof actions === "boolean")
        return actions;
    return q.Lambda(["oldDoc", "newDoc"], prepareRules(actions));
}
exports.WriteAction = WriteAction;
function CreateAction(actions) {
    if (actions) {
        actions = processActions(actions, [
        // is_activity_not_changed,
        // are_rights_not_changed
        ]);
        if (typeof actions === "boolean")
            return actions;
        return q.Lambda(["doc"], prepareRules(actions));
    }
    return false;
}
exports.CreateAction = CreateAction;
function DeleteAction(actions) {
    actions = processActions(actions);
    if (typeof actions === "boolean")
        return actions;
    return q.Lambda(["ref"], q.Let({ doc: q.Get(q.Var("ref")) }, prepareRules(actions)));
}
exports.DeleteAction = DeleteAction;
function HistoryReadAction(actions) {
    actions = processActions(actions);
    if (typeof actions === "boolean")
        return actions;
    return q.Lambda(["ref"], q.Let({ doc: q.Get(q.Var("ref")) }, prepareRules(actions)));
}
exports.HistoryReadAction = HistoryReadAction;
function HistoryWriteAction(actions) {
    actions = processActions(actions, [
    // is_activity_not_changed,
    // are_rights_not_changed
    ]);
    if (typeof actions === "boolean")
        return actions;
    return q.Lambda(["ref", "ts", "action", "doc"], prepareRules(actions));
}
exports.HistoryWriteAction = HistoryWriteAction;
function UnrestrictedReadAction(actions) {
    actions = processActions(actions);
    if (typeof actions === "boolean")
        return actions;
    return prepareRules(actions);
}
exports.UnrestrictedReadAction = UnrestrictedReadAction;
function CallAction(actions) {
    actions = processActions(actions, [
    // is_first_argument_identity
    // is_activity_not_changed,
    // are_rights_not_changed
    ]);
    if (typeof actions === "boolean")
        return actions;
    return q.Lambda("args", prepareRules(actions));
}
exports.CallAction = CallAction;

},{"faunadb":11,"~/factory/rule":87,"~/framework/api/default/rules":108,"~/framework/helpers/wrapDoc":151}],86:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const action_1 = require("./action");
function CustomPrivilege(privilege) {
    let { resource, actions } = privilege || {};
    return {
        resource,
        actions
    };
}
exports.CustomPrivilege = CustomPrivilege;
function QueryWrapper(expr) {
    if (typeof expr === "boolean") {
        return expr;
    }
    else {
        return faunadb_1.query.Query(expr);
    }
}
function Privilege(privilege) {
    let { resource, actions = {} } = privilege || {};
    let processedActions = {
        create: QueryWrapper(action_1.CreateAction(actions.create)),
        delete: QueryWrapper(action_1.DeleteAction(actions.delete)),
        read: QueryWrapper(action_1.ReadAction(actions.read)),
        write: QueryWrapper(action_1.WriteAction(actions.write)),
        history_write: QueryWrapper(action_1.HistoryWriteAction(actions.history_read)),
        history_read: QueryWrapper(action_1.HistoryReadAction(actions.history_read)),
        unrestricted_read: QueryWrapper(action_1.UnrestrictedReadAction(actions.unrestricted_read)),
        call: QueryWrapper(action_1.CallAction(actions.call))
    };
    let filteredActions = {};
    for (let action in actions) {
        filteredActions[action] = processedActions[action];
    }
    // console.log("filteredActions", resource, filteredActions);
    let result = {
        resource,
        actions: filteredActions
    };
    return result;
}
exports.Privilege = Privilege;

},{"./action":85,"faunadb":11}],87:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// External
const faunadb_1 = require("faunadb");
function RuleBuilder(rule) {
    return (...args) => (rule || {}).query(...args);
}
exports.RuleBuilder = RuleBuilder;
function Rule(rule) {
    return (rule || {}).query;
    // return (rule || {}).lambda
}
exports.Rule = Rule;
function Rules(rules) {
    if (rules.length > 1) {
        return faunadb_1.query.And(...rules);
    }
    else {
        return rules[0];
    }
}
exports.Rules = Rules;

},{"faunadb":11}],88:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/classes/collection");
const scaffold_1 = require("~/framework/api/collection/scaffold");
const field_1 = require("~/framework/api/collection/field");
const index_1 = require("~/framework/api/collection/index");
const compute_1 = require("~/framework/api/collection/compute");
const find_1 = require("~/framework/api/collection/find");
const paginate_1 = require("~/framework/api/collection/paginate");
const get_1 = require("~/framework/api/collection/get");
const insert_1 = require("~/framework/api/collection/insert");
const insertBatch_1 = require("~/framework/api/collection/insertBatch");
const replace_1 = require("~/framework/api/collection/replace");
const update_1 = require("~/framework/api/collection/update");
const repsert_1 = require("~/framework/api/collection/repsert");
const upsert_1 = require("~/framework/api/collection/upsert");
const delete_1 = require("~/framework/api/collection/delete");
const forget_1 = require("~/framework/api/collection/forget");
function collection(collectionNameOrOptions) {
    let self = this;
    let collectionDefinition = collection_1.Collection({});
    if (typeof collectionNameOrOptions === "string") {
        collectionDefinition.name = collectionNameOrOptions;
    }
    else if (typeof collectionNameOrOptions === "object") {
        Object.assign(collectionDefinition, collectionNameOrOptions);
    }
    if (!collectionDefinition.name) {
        throw new Error("biota.collection() - no valid collection name");
    }
    let methods = {
        scaffold: scaffold_1.scaffold.call(self, collectionDefinition),
        field: field_1.field.call(self, collectionDefinition),
        index: index_1.index.call(self, collectionDefinition),
        compute: compute_1.compute.call(self, collectionDefinition),
        find: find_1.find.call(self, collectionDefinition),
        paginate: paginate_1.paginate.call(self, collectionDefinition),
        get: get_1.get.call(self, collectionDefinition),
        insert: insert_1.insert.call(self, collectionDefinition),
        insertBatch: insertBatch_1.insertBatch.call(self, collectionDefinition),
        replace: replace_1.replace.call(self, collectionDefinition),
        update: update_1.update.call(self, collectionDefinition),
        repsert: repsert_1.repsert.call(self, collectionDefinition),
        upsert: upsert_1.upsert.call(self, collectionDefinition),
        delete: delete_1.deleteFn.call(self, collectionDefinition),
        forget: forget_1.forget.call(self, collectionDefinition),
        async changes() { }
    };
    return methods;
}
exports.collection = collection;

},{"~/factory/classes/collection":75,"~/framework/api/collection/compute":89,"~/framework/api/collection/delete":90,"~/framework/api/collection/field":91,"~/framework/api/collection/find":92,"~/framework/api/collection/forget":93,"~/framework/api/collection/get":94,"~/framework/api/collection/index":95,"~/framework/api/collection/insert":96,"~/framework/api/collection/insertBatch":97,"~/framework/api/collection/paginate":98,"~/framework/api/collection/replace":99,"~/framework/api/collection/repsert":100,"~/framework/api/collection/scaffold":101,"~/framework/api/collection/update":102,"~/framework/api/collection/upsert":103}],89:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const update_1 = require("~/factory/api/update");
// biota
const tasks_1 = require("~/tasks");
function compute(collectionDefinition) {
    let self = this;
    return async function computeMethod(field, options = {}) {
        let { role, roles } = options;
        let roleList = role || roles;
        if (!Array.isArray(roleList))
            roleList = [role];
        let tasks = [];
        tasks.push({
            name: `Scaffolding index field on ${collectionDefinition.name}`,
            async task() {
                return self
                    .collection(collectionDefinition.name)
                    .field({ ...field, action: "compute" })
                    .then(async (indexes) => {
                    for (let index of indexes) {
                        let { ref, name } = index || {};
                        if (name && role) {
                            let subTasks = [];
                            for (let r of roleList) {
                                subTasks.push({
                                    name: `Adding privilege (read) for index ${name} on ${r}`,
                                    task() {
                                        return self.query(update_1.update.role(r, {
                                            privileges: [
                                                {
                                                    resource: ref,
                                                    actions: {
                                                        read: true,
                                                        history_read: true
                                                    }
                                                }
                                            ]
                                        }));
                                    }
                                });
                            }
                            await tasks_1.execute(subTasks);
                        }
                    }
                    return indexes;
                });
            }
        });
        return tasks_1.execute(tasks, {
            domain: "DB.collection.compute"
        });
    };
}
exports.compute = compute;

},{"~/factory/api/update":73,"~/tasks":155}],90:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function deleteFn(collectionDefinition) {
    let self = this;
    return async function deleteMethod(id) {
        return tasks_1.execute([
            {
                name: `Delete (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).delete(id));
                }
            }
        ], {
            domain: "DB.collection.delete"
        });
    };
}
exports.deleteFn = deleteFn;

},{"~/factory/api/collection":66,"~/tasks":155}],91:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const tasks_1 = require("~/tasks");
const helpers = require("~/helpers");
const index_1 = require("~/factory/classes/index");
const upsert_1 = require("~/factory/api/upsert");
function fieldDefinition(field) {
    let definition = {
        inputs: [],
        outputs: [],
        // if one field
        field: undefined,
        data: {},
        reverse: false,
        binding: undefined,
        //
        name: undefined,
        action: undefined,
        ngram: false,
        ngramMin: 3,
        ngramMax: 10,
        // values: [],
        unique: false,
        serialized: undefined,
        permissions: undefined
    };
    if (typeof field === "string") {
        definition.name = field;
        definition.field = field;
    }
    else if (typeof field === "object") {
        Object.assign(definition, field);
    }
    return definition;
}
exports.fieldDefinition = fieldDefinition;
function field(collectionDefinition) {
    let self = this;
    return async function fieldMethod(field) {
        let definition = fieldDefinition(field);
        let index = index_1.Index({
            source: {
                collection: faunadb_1.query.Collection(collectionDefinition.name),
                fields: {}
            },
            // values: definition.values,
            unique: definition.unique,
            serialized: definition.serialized,
            // permissions: definition.permissions,
            data: definition.data
        });
        let tasks = [];
        // index inputs [] outputs []
        // index field for search
        // index field for search - ngram
        // index binding (2 ways, as term and as value)
        const buildTerm = ({ field, binding, reverse }, fields = {}) => {
            if (binding) {
                let bindingName = helpers.stringPath(field || "cursor");
                fields[bindingName] = binding;
                return { binding: bindingName, reverse };
            }
            else if (field) {
                return {
                    field: helpers.path(field),
                    reverse
                };
            }
        };
        // for search
        if (definition.action === "index") {
            if (definition.field) {
                index.terms = [
                    buildTerm({ field: definition.field, binding: definition.binding, reverse: definition.reverse }, index.source.fields)
                ];
            }
            else if (definition.inputs.length > 0) {
                index.terms = definition.inputs.map((input) => {
                    if (typeof input === "string") {
                        return buildTerm({ field: input }, index.source.fields);
                    }
                    else if (input.binding) {
                        return buildTerm({ field: input.field, binding: input.binding, reverse: input.reverse }, index.source.fields);
                    }
                    else if (input.field) {
                        return buildTerm({ field: input.field }, index.source.fields);
                    }
                });
            }
            else {
                index.terms = [
                    {
                        field: ["ref"]
                    }
                ];
            }
            if (definition.outputs.length > 0) {
                index.values = definition.outputs.map((input) => {
                    if (typeof input === "string") {
                        return buildTerm({ field: input }, index.source.fields);
                    }
                    else if (input.binding) {
                        let bindingName = helpers.stringPath(input.field) || "cursor";
                        index.source.fields[helpers.stringPath(bindingName)] = input.binding;
                        return buildTerm({ field: input.field, binding: input.binding, reverse: input.reverse }, index.source.fields);
                    }
                    else if (input.field) {
                        return buildTerm({ field: input.field }, index.source.fields);
                    }
                });
            }
            else {
                index.values = [
                    {
                        field: ["ref"]
                    }
                ];
            }
            index.name = index_1.indexNameNormalized(helpers.name([collectionDefinition.name, "search", "on", helpers.stringPath(definition.name || definition.field)]));
            // if (definition.field === "at") {
            //   console.log(JSON.stringify(index, null, 2));
            // }
            if (definition.ngram) {
                if (index.terms.length > 0 && index.terms.length > 1) {
                    throw new Error(`Can't produce an ngram index with ${index.terms.length} terms`);
                }
                let fieldName = "";
                try {
                    fieldName = helpers.stringPath(definition.field || index.terms[0].field);
                }
                catch (error) {
                    throw new Error(`Couldn't find a correct field name`);
                }
                let ngramFieldName = "ngram:" + fieldName;
                let ngramIndex = {
                    name: index_1.indexNameNormalized(helpers.name([collectionDefinition.name, "ngram", "on", helpers.stringPath(fieldName)])),
                    source: {
                        collection: faunadb_1.query.Collection(collectionDefinition.name),
                        fields: {
                            [ngramFieldName]: faunadb_1.query.Query(faunadb_1.query.Lambda("instance", faunadb_1.query.Distinct(index_1.NGramOnField(definition.ngramMax, helpers.path(definition.field)))))
                        }
                    },
                    terms: [
                        {
                            binding: ngramFieldName
                        }
                    ],
                    serialized: true,
                    data: definition.data
                };
                tasks.push({
                    name: `Creating (ngram search) index: ${ngramIndex.name}`,
                    async task() {
                        return self.query(upsert_1.upsert.index(ngramIndex));
                    },
                    fullError: true
                });
            }
            else {
                tasks.push({
                    name: `Creating (search) index: ${index.name}`,
                    async task() {
                        return self.query(upsert_1.upsert.index(index));
                    }
                });
            }
        }
        // for value
        else if (definition.action === "compute") {
            const fieldOrName = definition.field || definition.name;
            index.source.fields[fieldOrName] = definition.binding;
            let indexByBinding = {
                ...index,
                name: index_1.indexNameNormalized(helpers.name([collectionDefinition.name, "compute", "on", helpers.stringPath(fieldOrName)])),
                values: [
                    {
                        binding: fieldOrName
                    }
                ],
                terms: [
                    {
                        field: ["ref"]
                    }
                ]
            };
            tasks.push({
                name: `Creating (search compute) index: ${indexByBinding.name}`,
                async task() {
                    return self.query(upsert_1.upsert.index(indexByBinding));
                }
            });
            // let indexByRef = {
            //   ...index,
            //   name: indexNameNormalized(
            //     helpers.name([collectionDefinition.name, "computed", "as", helpers.stringPath(definition.name || definition.field)])
            //   ),
            //   values: [
            //     {
            //       field: ["ref"]
            //     }
            //   ],
            //   terms: [
            //     {
            //       binding: definition.field
            //     }
            //   ]
            // };
            // tasks.push({
            //   name: `Creating (compute value) index: ${indexByRef.name}`,
            //   async task() {
            //     return self.query(upsert.index(indexByRef));
            //   }
            // });
        }
        // console.log("definition", definition);
        return tasks_1.execute(tasks, {
            domain: "DB.collection.field"
        });
    };
}
exports.field = field;

},{"faunadb":11,"~/factory/api/upsert":74,"~/factory/classes/index":77,"~/helpers":153,"~/tasks":155}],92:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qs = require("querystring");
const faunadb_1 = require("faunadb");
const tasks_1 = require("~/tasks");
const udfunction_1 = require("~/factory/classes/udfunction");
function parseSearchQuery(collection, searchQuery) {
    const buildQuery = (sq) => {
        return faunadb_1.query.Call(udfunction_1.udfunctionNameNormalized("SearchQuery"), [faunadb_1.query.Collection(collection), sq]);
    };
    const safe = (x) => JSON.parse(JSON.stringify(x));
    const operators = {
        $and: (...queries) => {
            return faunadb_1.query.Intersection(...queries.map(buildQuery));
        },
        $or: (...queries) => {
            console.log("queries", queries);
            return faunadb_1.query.Union(...queries.map(buildQuery));
        },
        $nor: (query, ...queries) => {
            return faunadb_1.query.Difference(buildQuery(query), ...queries.map(buildQuery));
        }
        // $not: (source: Fauna.Expr, query: Fauna.Expr) =>
        //   q.Difference(source, query)
        // $distinct: (queries: Fauna.Expr[]) => q.Distinct(queries)
    };
    const isOperator = (key) => Object.keys(operators).includes(key);
    const hasOperators = (obj) => Object.keys(obj).some(key => Object.keys(operators).includes(key));
    const getFirstOperator = (obj) => {
        return Object.keys(obj).find(key => isOperator(key));
    };
    // UPDATE!
    const reducer = (obj) => {
        let reduced = {};
        const reducee = (value, acc) => {
            if (typeof value === "object") {
                if (hasOperators(value)) {
                    let operator = getFirstOperator(value);
                    let operatorValue = value[operator];
                    let operation = operators[operator](...operatorValue);
                    Object.assign(acc, operation);
                }
                else {
                    for (let key in value) {
                        acc[key] = {};
                        reducee(value[key], acc[key]);
                    }
                }
            }
            else if (Array.isArray(value)) {
                acc = value.map((item) => {
                    if (typeof item === "object" || Array.isArray(item)) {
                        return reducer(item);
                    }
                    else {
                        return item;
                    }
                });
            }
            else {
                acc = value;
            }
        };
        reducee(obj, reduced);
        return reduced;
    };
    if (!searchQuery) {
        return faunadb_1.query.Documents(faunadb_1.query.Collection(collection));
    }
    if (!hasOperators(searchQuery)) {
        return buildQuery(searchQuery);
    }
    else {
        return reducer(searchQuery);
    }
}
exports.parseSearchQuery = parseSearchQuery;
function find(collectionDefinition) {
    let self = this;
    return async function findMethod(searchQuery, paginateOptions = {}, mapper = faunadb_1.query.Lambda("x", faunadb_1.query.Get(faunadb_1.query.Var("x")))) {
        return tasks_1.execute([
            {
                name: `Find (${qs.stringify(searchQuery).slice(0, 20)}...) in (${collectionDefinition.name})`,
                task() {
                    let paginate = faunadb_1.query.Paginate(parseSearchQuery(collectionDefinition.name, searchQuery), paginateOptions);
                    return self.query(mapper ? faunadb_1.query.Map(paginate, mapper) : paginate);
                }
            }
        ], {
            domain: "DB.collection.find"
        });
    };
}
exports.find = find;

},{"faunadb":11,"querystring":31,"~/factory/classes/udfunction":79,"~/tasks":155}],93:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function forget(collectionDefinition) {
    let self = this;
    return async function forgetMethod(id) {
        return tasks_1.execute([
            {
                name: `Forget (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).forget(id));
                }
            }
        ], {
            domain: "DB.collection.forget"
        });
    };
}
exports.forget = forget;

},{"~/factory/api/collection":66,"~/tasks":155}],94:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function get(collectionDefinition) {
    let self = this;
    return async function getMethod(id) {
        return tasks_1.execute([
            {
                name: `Get (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).get(id));
                }
            }
        ], {
            domain: "DB.collection.get"
        });
    };
}
exports.get = get;

},{"~/factory/api/collection":66,"~/tasks":155}],95:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("~/factory");
const tasks_1 = require("~/tasks");
function index(collectionDefinition) {
    let self = this;
    return async function indexMethod(field, options = {}) {
        let { role, roles, maxLength } = options;
        let roleList = role || roles;
        if (!Array.isArray(roleList))
            roleList = [role];
        let tasks = [];
        let definition = {
            field: null,
            action: "index",
            ngram: false,
            ngramMax: maxLength
        };
        if (typeof field === "string") {
            definition.field = field;
        }
        else if (typeof field === "object") {
            Object.assign(definition, field);
        }
        tasks.push({
            name: `Adding index field ${definition.field} on ${collectionDefinition.name}`,
            async task() {
                return self
                    .collection(collectionDefinition.name)
                    .field(definition)
                    .then(async (indexes) => {
                    for (let index of indexes) {
                        let { ref, name } = index || {};
                        if (name && role) {
                            let subTasks = [];
                            for (let r of roleList) {
                                subTasks.push({
                                    name: `Adding privilege (read) for index ${name} on ${r}`,
                                    task() {
                                        return self.query(factory_1.update.role(r, {
                                            privileges: [
                                                {
                                                    resource: ref,
                                                    actions: {
                                                        read: true,
                                                        history_read: true
                                                    }
                                                }
                                            ]
                                        }));
                                    },
                                    fullError: true
                                });
                            }
                            await tasks_1.execute(subTasks);
                        }
                    }
                    return indexes;
                });
            }
        });
        return tasks_1.execute(tasks, {
            domain: "DB.collection.index"
        });
    };
}
exports.index = index;

},{"~/factory":80,"~/tasks":155}],96:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function insert(collectionDefinition) {
    let self = this;
    return async function insertMethod(data, options) {
        let { keepId = false } = options || {};
        const { id, credentials } = data || {};
        return tasks_1.execute([
            {
                name: (keepId ? `Upserting ${id}` : `Inserting`) + ` in ${collectionDefinition.name}`,
                task() {
                    if (keepId) {
                        if (!id)
                            throw new Error(`Doesn't have any given id`);
                        return self.query(collection_1.collection(collectionDefinition.name).upsert(data.data || {}, { id, credentials }));
                    }
                    else {
                        return self.query(collection_1.collection(collectionDefinition.name).insert(data));
                    }
                }
            }
        ], {
            domain: "DB.collection.insert"
        });
    };
}
exports.insert = insert;

},{"~/factory/api/collection":66,"~/tasks":155}],97:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
const helpers = require("~/helpers");
// biota
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function insertBatch(collectionDefinition) {
    let self = this;
    return async function insertBatchMethod(data, options = {}) {
        let { batchSize = 50, keepId = false } = options;
        let items = data;
        if (!Array.isArray(items))
            items = [items];
        let batches = helpers.splitEvery(batchSize, items);
        let tasks = [];
        let query;
        if (keepId) {
            query = faunadb_1.query.Let({
                data: faunadb_1.query.Select("data", faunadb_1.query.Var("item"), {}),
                credentials: faunadb_1.query.Select("credentials", faunadb_1.query.Var("item"), {}),
                id: faunadb_1.query.Select("id", faunadb_1.query.Var("item"), null)
            }, faunadb_1.query.If(faunadb_1.query.Var("id"), collection_1.collection(collectionDefinition.name).upsert(faunadb_1.query.Var("data"), {
                id: faunadb_1.query.Var("id"),
                credentials: faunadb_1.query.Var("credentials")
            }), null));
        }
        else {
            query = collection_1.collection(collectionDefinition.name).insert(faunadb_1.query.Var("item"));
        }
        for (let [index, batch] of Object.entries(batches)) {
            tasks.push({
                name: `Inserting batch n°${index + 1} on ${batches.length}`,
                task() {
                    return self.query(faunadb_1.query.Map(batch, faunadb_1.query.Lambda("item", query)));
                }
            });
        }
        return tasks_1.execute(tasks, {
            domain: "DB.collection.insertBatch"
        });
    };
}
exports.insertBatch = insertBatch;

},{"faunadb":11,"~/factory/api/collection":66,"~/helpers":153,"~/tasks":155}],98:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("~/tasks");
function paginate(collectionDefinition) {
    let self = this;
    return async function* paginateMethod(searchQuery, paginateOptions = {}, mapper) {
        let firstRequest = true;
        let after;
        while (after || firstRequest) {
            if (firstRequest)
                firstRequest = false;
            yield tasks_1.execute([
                {
                    name: `Paginate after ${after} in (${collectionDefinition.name})`,
                    async task() {
                        return self
                            .collection(collectionDefinition.name)
                            .find(searchQuery, { ...paginateOptions, after }, mapper)
                            .then((res) => {
                            if (res.after) {
                                after = res.after;
                            }
                            else {
                                after = undefined;
                            }
                            return res;
                        });
                    }
                }
            ], {
                domain: "DB.collection.paginate"
            });
        }
    };
}
exports.paginate = paginate;

},{"~/tasks":155}],99:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function replace(collectionDefinition) {
    let self = this;
    return async function replaceMethod(id, data) {
        return tasks_1.execute([
            {
                name: `Replace (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).replace(id, data));
                }
            }
        ], {
            domain: "DB.collection.replace"
        });
    };
}
exports.replace = replace;

},{"~/factory/api/collection":66,"~/tasks":155}],100:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function repsert(collectionDefinition) {
    let self = this;
    return async function repsertMethod(id, data) {
        return tasks_1.execute([
            {
                name: `Replace/Insert (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).repsert(id, data));
                }
            }
        ], {
            domain: "DB.collection.repsert"
        });
    };
}
exports.repsert = repsert;

},{"~/factory/api/collection":66,"~/tasks":155}],101:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("~/factory");
const tasks_1 = require("~/tasks");
function scaffold(collectionDefinition) {
    let self = this;
    return async function scaffoldMethod(options = {}) {
        let defaultSearchable = [
            "~ref",
            "~ts",
            "access.roles",
            "access.owner",
            "access.assignees",
            "activity.assigned_by",
            // "activity.assigned_at",
            "activity.owner_changed_by",
            // "activity.owner_changed_at",
            "activity.credentials_changed_by",
            // "activity.credentials_changed_at",
            "activity.created_by",
            // "activity.created_at",
            "activity.updated_by",
            // "activity.updated_at",
            "activity.replaced_by",
            // "activity.replaced_at",
            "activity.expired_by",
            // "activity.expired_at",
            "activity.deleted_by",
            // "activity.deleted_at",
            "activity.archived_by",
            // "activity.archived_at",
            "activity.hidden_by"
            // "activity.hidden_at"
        ];
        let { index = defaultSearchable, compute = [], field = [] } = options || {};
        let tasks = [
            {
                name: `Upserting collection (${collectionDefinition.name})`,
                async task() {
                    return self.query(factory_1.upsert.collection(collectionDefinition));
                }
            }
        ];
        for (let indexField of index) {
            tasks.push({
                name: `Upserting index field (${indexField}) on (${collectionDefinition.name})`,
                async task() {
                    return self.collection(collectionDefinition.name).index(indexField, { role: "user" });
                }
            });
        }
        for (let computeField of compute) {
            tasks.push({
                name: `Upserting viewable field (${computeField.field}) on (${collectionDefinition.name})`,
                async task() {
                    return self.collection(collectionDefinition.name).compute(computeField, { role: "user" });
                }
            });
        }
        for (let fieldField of field) {
            tasks.push({
                name: `Upserting viewable field (${fieldField.field}) on (${collectionDefinition.name})`,
                async task() {
                    return self.collection(collectionDefinition.name).field(fieldField);
                }
            });
        }
        return tasks_1.execute(tasks, {
            domain: "DB.collection.scaffold"
        });
    };
}
exports.scaffold = scaffold;

},{"~/factory":80,"~/tasks":155}],102:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function update(collectionDefinition) {
    let self = this;
    return async function updateMethod(id, data) {
        return tasks_1.execute([
            {
                name: `Update (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).update(id, data));
                }
            }
        ], {
            domain: "DB.collection.update"
        });
    };
}
exports.update = update;

},{"~/factory/api/collection":66,"~/tasks":155}],103:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
function upsert(collectionDefinition) {
    let self = this;
    return async function upsertMethod(id, data) {
        return tasks_1.execute([
            {
                name: `Update/Insert (${id}) in (${collectionDefinition.name})`,
                task() {
                    return self.query(collection_1.collection(collectionDefinition.name).upsert(id, data));
                }
            }
        ], {
            domain: "DB.collection.upsert"
        });
    };
}
exports.upsert = upsert;

},{"~/factory/api/collection":66,"~/tasks":155}],104:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("~/framework/default/collections/users"));
__export(require("~/framework/default/collections/actions"));
__export(require("~/framework/default/collections/relations"));

},{"~/framework/default/collections/actions":114,"~/framework/default/collections/relations":115,"~/framework/default/collections/users":116}],105:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// admin
__export(require("~/framework/default/functions/log_action"));
// system
__export(require("~/framework/default/functions/find_index"));
__export(require("~/framework/default/functions/search_query"));
// crud
__export(require("~/framework/default/functions/insert"));
__export(require("~/framework/default/functions/update"));
__export(require("~/framework/default/functions/assign"));
__export(require("~/framework/default/functions/archive"));
__export(require("~/framework/default/functions/change_password"));
__export(require("~/framework/default/functions/delete"));
__export(require("~/framework/default/functions/expire"));
__export(require("~/framework/default/functions/forget"));
__export(require("~/framework/default/functions/own"));
__export(require("~/framework/default/functions/replace"));
// advanced
__export(require("~/framework/default/functions/relations"));
// usual
__export(require("~/framework/default/functions/array"));

},{"~/framework/default/functions/archive":117,"~/framework/default/functions/array":118,"~/framework/default/functions/assign":119,"~/framework/default/functions/change_password":120,"~/framework/default/functions/delete":121,"~/framework/default/functions/expire":122,"~/framework/default/functions/find_index":123,"~/framework/default/functions/forget":124,"~/framework/default/functions/insert":125,"~/framework/default/functions/log_action":126,"~/framework/default/functions/own":127,"~/framework/default/functions/relations":128,"~/framework/default/functions/replace":129,"~/framework/default/functions/search_query":130,"~/framework/default/functions/update":131}],106:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("~/framework/default/indexes/indexes__by__resource"));
__export(require("~/framework/default/indexes/indexes__by__terms"));

},{"~/framework/default/indexes/indexes__by__resource":132,"~/framework/default/indexes/indexes__by__terms":133}],107:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("~/framework/default/roles/user"));
__export(require("~/framework/default/roles/system"));

},{"~/framework/default/roles/system":134,"~/framework/default/roles/user":135}],108:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("~/framework/default/rules/all"));
__export(require("~/framework/default/rules/are_rights_not_changed"));
__export(require("~/framework/default/rules/is_activity_not_changed"));
__export(require("~/framework/default/rules/has_role"));
__export(require("~/framework/default/rules/is_assignee"));
__export(require("~/framework/default/rules/is_not_assignee"));
__export(require("~/framework/default/rules/is_document_available"));
__export(require("~/framework/default/rules/is_first_argument_identity"));
__export(require("~/framework/default/rules/is_not_owner"));
__export(require("~/framework/default/rules/is_owner"));
__export(require("~/framework/default/rules/is_self"));
__export(require("~/framework/default/rules/none"));

},{"~/framework/default/rules/all":136,"~/framework/default/rules/are_rights_not_changed":137,"~/framework/default/rules/has_role":138,"~/framework/default/rules/is_activity_not_changed":139,"~/framework/default/rules/is_assignee":140,"~/framework/default/rules/is_document_available":141,"~/framework/default/rules/is_first_argument_identity":142,"~/framework/default/rules/is_not_assignee":143,"~/framework/default/rules/is_not_owner":144,"~/framework/default/rules/is_owner":145,"~/framework/default/rules/is_self":146,"~/framework/default/rules/none":147}],109:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const tasks_1 = require("~/tasks");
const create_1 = require("~/factory/api/create");
const upsert_1 = require("~/factory/api/upsert");
const repsert_1 = require("~/factory/api/repsert");
const defaultFunctions = require("~/framework/api/default/functions");
const defaultRoles = require("~/framework/api/default/roles");
const defaultCollections = require("~/framework/api/default/collections");
const defaultIndexes = require("~/framework/api/default/indexes");
async function foundation(options) {
    const self = this;
    options = { roles: true, functions: true, collections: true, indexes: true, ...options };
    let tasks = [];
    /**
     *  Roles (base)
     */
    if (options.roles) {
        for (let defaultRole of Object.values(defaultRoles)) {
            tasks.push({
                name: `Creating (base) role: ${defaultRole.name}`,
                task() {
                    return self.query(faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Role(defaultRole.name)), null, create_1.create.role(defaultRole.name)));
                }
            });
        }
    }
    /**
     *  Functions
     */
    if (options.functions) {
        for (let UDFunction of Object.values(defaultFunctions)) {
            tasks.push({
                name: `Upserting function: ${UDFunction.name}`,
                task() {
                    return self.query(repsert_1.repsert.function(UDFunction));
                },
                fullError: true
            });
        }
    }
    /**
     *  Collections
     */
    if (options.collections) {
        tasks.push({
            name: `Scaffold collection: ${defaultCollections.users.name}`,
            task() {
                return self.collection(defaultCollections.users).scaffold();
            }
        });
        tasks.push({
            name: `Scaffold collection: ${defaultCollections.actions.name}`,
            task() {
                return self.collection(defaultCollections.actions).scaffold({
                    index: [
                        "document",
                        "ts",
                        "user",
                        "name",
                        {
                            field: "at",
                            binding: faunadb_1.query.Query(faunadb_1.query.Lambda("doc", faunadb_1.query.Let({
                                ts: faunadb_1.query.Select("ts", faunadb_1.query.Var("doc"), null)
                            }, faunadb_1.query.If(faunadb_1.query.IsTimestamp(faunadb_1.query.Var("ts")), faunadb_1.query.ToTime(faunadb_1.query.Var("ts")), null))))
                        }
                    ]
                });
            }
        });
        tasks.push({
            name: `Scaffold collection: ${defaultCollections.relations.name}`,
            task() {
                return self.collection(defaultCollections.relations).scaffold({
                    index: ["name", "parts.relation", "parts.collection", "parts.path"],
                    field: [
                        {
                            field: "uniqueness_check",
                            unique: true,
                            outputs: [
                                {
                                    field: "data.parts.0.relation"
                                },
                                {
                                    field: "data.parts.0.collection"
                                },
                                {
                                    field: "data.parts.0.path"
                                },
                                {
                                    field: "data.parts.1.relation"
                                },
                                {
                                    field: "data.parts.1.collection"
                                },
                                {
                                    field: "data.parts.1.path"
                                }
                            ]
                        }
                    ]
                });
            },
            fullError: true
        });
    }
    /**
     *  Indexes
     */
    if (options.indexes) {
        for (let defaultIndex of Object.values(defaultIndexes)) {
            tasks.push({
                name: `Upserting index: ${defaultIndex.name}`,
                task() {
                    return self.query(upsert_1.upsert.index(defaultIndex));
                }
            });
        }
    }
    /**
     *  Roles
     */
    if (options.roles) {
        for (let defaultRole of Object.values(defaultRoles)) {
            tasks.push({
                name: `Upserting role: ${defaultRole.name}`,
                task() {
                    return self.query(upsert_1.upsert.role(defaultRole));
                },
                fullError: true
            });
        }
    }
    return tasks_1.execute(tasks, {
        domain: "DB.foundation"
    });
}
exports.foundation = foundation;

},{"faunadb":11,"~/factory/api/create":67,"~/factory/api/repsert":72,"~/factory/api/upsert":74,"~/framework/api/default/collections":104,"~/framework/api/default/functions":105,"~/framework/api/default/indexes":106,"~/framework/api/default/roles":107,"~/tasks":155}],110:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const db_1 = require("~/db");
const collectionFactory = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
async function login(id, password) {
    return tasks_1.execute([
        {
            name: `Loggin in as (${id})`,
            task() {
                return this.query(collectionFactory.collection("users").login(id, password)).then(({ secret }) => new db_1.DB({ secret }));
            }
        }
    ], {
        domain: "DB.login"
    });
}
exports.login = login;

},{"~/db":65,"~/factory/api/collection":66,"~/tasks":155}],111:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
const tasks_1 = require("~/tasks");
function* paginate(paginateQuery, paginateOptions = {}) {
    let after = Infinity;
    while (after) {
        yield tasks_1.execute([
            {
                name: `Paginating your query`,
                task() {
                    return this.client.query(faunadb_1.query.Paginate(paginateQuery, paginateOptions)).then((res) => {
                        if (res.after) {
                            after = res.after;
                        }
                        else {
                            after = undefined;
                        }
                        return res;
                    });
                }
            }
        ], {
            singleResult: true,
            domain: "DB.paginate"
        });
    }
}
exports.paginate = paginate;

},{"faunadb":11,"~/tasks":155}],112:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function query(fqlQuery) {
    return this.client.query(fqlQuery);
}
exports.query = query;

},{}],113:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// biota
const collection_1 = require("~/factory/classes/collection");
const helpers_1 = require("~/helpers");
const tasks_1 = require("~/tasks");
function relation(relationName) {
    let self = this;
    let definition = {
        name: relationName,
        // Does the relation implies deep destruction/delete
        destructive: false,
        parts: []
    };
    async function buildRelation() {
        if (!definition.name)
            definition.name = helpers_1.name([""]);
        let relations = definition.parts.map(p => p.relation);
        let firstRelation = definition.parts[0];
        let secondRelation = definition.parts[1];
        let tasks = [];
        tasks.push({
            async task() {
                // let existingRelations = await self.collection(collectionNameNormalized("relations")).find({
                //   $and: [
                //     {
                //       "parts.collection": firstRelation.collection,
                //       "parts.relation": firstRelation.relation,
                //       "parts.path": firstRelation.path
                //     },
                //     {
                //       "parts.collection": secondRelation.collection,
                //       "parts.relation": secondRelation.relation,
                //       "parts.path": secondRelation.path
                //     }
                //   ]
                // });
                return self.collection(collection_1.collectionNameNormalized("relations")).insert({
                    data: {
                        relations: {}
                    }
                });
            }
        });
        // one-to-one
        if (relations.includes("one") && !relations.includes("many")) {
        }
        // many-to-one / one-to-many
        else if (relations.includes("one") && relations.includes("many")) {
        }
        // many-to-many
        else if (relations.includes("many") && !relations.includes("one")) {
        }
        else {
            throw new Error(`Relation ${helpers_1.name} isn't right`);
        }
        return tasks_1.execute(tasks);
    }
    let firstApi = {
        many: function (collection, path = "~ref") {
            definition.parts.push({
                relation: "many",
                collection: collection_1.collectionNamePlural(collection),
                path
            });
            return secondApi;
        },
        one: function (collection, path = "~ref") {
            definition.parts.push({
                relation: "one",
                collection: collection_1.collectionNamePlural(collection),
                path
            });
            return secondApi;
        }
    };
    let secondMethods = {
        many: function (collection, path = "~ref") {
            definition.parts.push({
                relation: "many",
                collection: collection_1.collectionNamePlural(collection),
                path
            });
            return buildRelation();
        },
        one: function (collection, path = "~ref") {
            definition.parts.push({
                relation: "one",
                collection: collection_1.collectionNamePlural(collection),
                path
            });
            return buildRelation();
        }
    };
    let secondApi = {
        connects: secondMethods,
        can: {
            have: secondMethods
        }
    };
    return firstApi;
}
exports.relation = relation;

},{"~/factory/classes/collection":75,"~/helpers":153,"~/tasks":155}],114:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
// biota
const collection_1 = require("~/factory/classes/collection");
exports.actions = collection_1.Collection({
    name: collection_1.collectionNameNormalized("actions"),
    history_days: null,
    ttl_days: null
});

},{"~/factory/classes/collection":75}],115:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
// biota
const collection_1 = require("~/factory/classes/collection");
exports.relations = collection_1.Collection({
    name: collection_1.collectionNameNormalized("relations"),
    history_days: null,
    ttl_days: null
});

},{"~/factory/classes/collection":75}],116:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
// biota
const collection_1 = require("~/factory/classes/collection");
exports.users = collection_1.Collection({
    name: "users",
    history_days: null,
    ttl_days: null
});

},{"~/factory/classes/collection":75}],117:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Archive = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Archive"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref", "at"], WrapActionAndLog_1.WrapActionAndLog("archive", faunadb_1.query.Update(faunadb_1.query.Var("ref"), { data: logData_1.logData.archive() }))))
});

},{"faunadb":11,"~/factory/classes/udfunction":79,"~/framework/helpers/WrapActionAndLog":148,"~/framework/helpers/logData":149}],118:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
exports.Reverse = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Array.Reverse"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["arr"], faunadb_1.query.Reduce(faunadb_1.query.Lambda(["reversed", "item"], faunadb_1.query.Prepend(faunadb_1.query.Var("item"), faunadb_1.query.Var("reversed"))), [], faunadb_1.query.Var("arr"))))
});

},{"faunadb":11,"~/factory/classes/udfunction":79}],119:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Assign = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Assign"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref", "data"], WrapActionAndLog_1.WrapActionAndLog("assign", faunadb_1.query.Update(faunadb_1.query.Var("ref"), { data: logData_1.logData.assign() }))))
});

},{"faunadb":11,"~/factory/classes/udfunction":79,"~/framework/helpers/WrapActionAndLog":148,"~/framework/helpers/logData":149}],120:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
const logData_1 = require("~/framework/helpers/logData");
exports.ChangePassword = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("ChangePassword"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref", "password"], WrapActionAndLog_1.WrapActionAndLog("credentials", faunadb_1.query.Update(faunadb_1.query.Var("ref"), {
        data: logData_1.logData.credentials(),
        credentials: {
            password: faunadb_1.query.Var("password")
        }
    })))),
});

},{"faunadb":11,"~/factory/classes/udfunction":79,"~/framework/helpers/WrapActionAndLog":148,"~/framework/helpers/logData":149}],121:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Delete = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Delete"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref", "at"], WrapActionAndLog_1.WrapActionAndLog("delete", faunadb_1.query.Update(faunadb_1.query.Var("ref"), { data: logData_1.logData.delete() })))),
});

},{"faunadb":11,"~/factory/classes/udfunction":79,"~/framework/helpers/WrapActionAndLog":148,"~/framework/helpers/logData":149}],122:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Expire = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Expire"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref", "at"], WrapActionAndLog_1.WrapActionAndLog("expire", faunadb_1.query.Update(faunadb_1.query.Var("ref"), { data: logData_1.logData.expire() }))))
});

},{"faunadb":11,"~/factory/classes/udfunction":79,"~/framework/helpers/WrapActionAndLog":148,"~/framework/helpers/logData":149}],123:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const index_1 = require("~/factory/classes/index");
exports.FindIndex = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("FindIndex"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["resource", "terms_fields"], faunadb_1.query.Let({
        indexes: faunadb_1.query.Paginate(faunadb_1.query.Intersection(faunadb_1.query.Match(faunadb_1.query.Index(index_1.indexNameNormalized("indexes__by__resource")), [
            faunadb_1.query.Var("resource")
        ]), faunadb_1.query.Union(faunadb_1.query.Map(faunadb_1.query.Var("terms_fields"), faunadb_1.query.Lambda(["field"], faunadb_1.query.Match(faunadb_1.query.Index(index_1.indexNameNormalized("indexes__by__terms")), [
            faunadb_1.query.Var("field")
        ])))))),
        termsCount: faunadb_1.query.Count(faunadb_1.query.Var("terms_fields")),
        filteredIndexes: faunadb_1.query.Filter(faunadb_1.query.Var("indexes"), faunadb_1.query.Lambda(["index"], faunadb_1.query.Equals(faunadb_1.query.Var("termsCount"), faunadb_1.query.Count(faunadb_1.query.Select("terms", faunadb_1.query.Get(faunadb_1.query.Var("index")), Infinity)))))
    }, faunadb_1.query.Select(0, faunadb_1.query.Var("filteredIndexes"), null)))),
    role: faunadb_1.query.Role("system")
});

},{"faunadb":11,"~/factory/classes/index":77,"~/factory/classes/udfunction":79}],124:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
exports.Forget = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Forget"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref", "at"], WrapActionAndLog_1.WrapActionAndLog("forget", faunadb_1.query.Delete(faunadb_1.query.Var("ref"))))),
});

},{"faunadb":11,"~/factory/classes/udfunction":79,"~/framework/helpers/WrapActionAndLog":148}],125:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Insert = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Insert"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "collectionRef", "data"], WrapActionAndLog_1.WrapActionAndLog("insert", faunadb_1.query.Create(faunadb_1.query.Var("collectionRef"), { data: logData_1.logData.insert() }))))
});

},{"faunadb":11,"~/factory/classes/udfunction":79,"~/framework/helpers/WrapActionAndLog":148,"~/framework/helpers/logData":149}],126:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const collection_1 = require("~/factory/classes/collection");
exports.LogAction = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("LogAction"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["documentRef", "ts", "userRef", "actionName"], faunadb_1.query.Create(faunadb_1.query.Collection(collection_1.collectionNameNormalized("actions")), {
        data: {
            document: faunadb_1.query.Var("documentRef"),
            ts: faunadb_1.query.Var("ts"),
            user: faunadb_1.query.Var("userRef"),
            name: faunadb_1.query.Var("actionName")
        }
    })))
});

},{"faunadb":11,"~/factory/classes/collection":75,"~/factory/classes/udfunction":79}],127:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Own = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Own"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref", "data"], WrapActionAndLog_1.WrapActionAndLog("own", faunadb_1.query.Update(faunadb_1.query.Var("ref"), { data: logData_1.logData.own() })))),
});

},{"faunadb":11,"~/factory/classes/udfunction":79,"~/framework/helpers/WrapActionAndLog":148,"~/framework/helpers/logData":149}],128:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const collection_1 = require("~/factory/classes/collection");
exports.Relations = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Relations"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref"], faunadb_1.query.If(faunadb_1.query.And(faunadb_1.query.IsRef(faunadb_1.query.Var("ref")), faunadb_1.query.Exists(faunadb_1.query.Var("ref"))), faunadb_1.query.Let({
        relations: faunadb_1.query.Map(faunadb_1.query.Paginate(faunadb_1.query.Call(udfunction_1.udfunctionNameNormalized("SearchQuery"), [
            faunadb_1.query.Collection(collection_1.collectionNameNormalized("relations")),
            {
                "parts.collection": faunadb_1.query.Select("collection", faunadb_1.query.Var("ref"), null)
            }
        ]), { size: 1000 }), x => faunadb_1.query.Get(x))
    }, faunadb_1.query.If(faunadb_1.query.Not(faunadb_1.query.IsEmpty(faunadb_1.query.Var("relations"))), faunadb_1.query.Var("relations"), [])), faunadb_1.query.Abort("Ref doesn't exists"))))
});

},{"faunadb":11,"~/factory/classes/collection":75,"~/factory/classes/udfunction":79}],129:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Replace = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Replace"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref", "data"], WrapActionAndLog_1.WrapActionAndLog("replace", faunadb_1.query.Do(faunadb_1.query.Replace(faunadb_1.query.Var("ref"), { data: faunadb_1.query.Var("data") }), faunadb_1.query.Update(faunadb_1.query.Var("ref"), { data: logData_1.logData.replace() }))))),
});

},{"faunadb":11,"~/factory/classes/udfunction":79,"~/framework/helpers/WrapActionAndLog":148,"~/framework/helpers/logData":149}],130:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const index_1 = require("~/factory/classes/index");
const path_1 = require("~/framework/helpers/path");
exports.SearchQuery = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("SearchQuery"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["resource", "search_terms"], faunadb_1.query.Let({
        searchTerms: faunadb_1.query.ToArray(faunadb_1.query.Var("search_terms")),
        termIndexes: faunadb_1.query.Map(faunadb_1.query.Var("searchTerms"), faunadb_1.query.Lambda(["field", "value"], faunadb_1.query.If(faunadb_1.query.IsObject(faunadb_1.query.Var("value")), faunadb_1.query.If(faunadb_1.query.Contains("$ngram", faunadb_1.query.Var("value")), [
            faunadb_1.query.Call(index_1.indexNameNormalized("FindIndex"), [
                faunadb_1.query.Var("resource"),
                [faunadb_1.query.Concat(["binding:", "ngram:", faunadb_1.query.Var("field")])]
            ]),
            faunadb_1.query.LowerCase(faunadb_1.query.ToString(faunadb_1.query.Select("$ngram", faunadb_1.query.Var("value"), ""))),
            faunadb_1.query.Concat(["ngram:", path_1.pathString(faunadb_1.query.Var("field"))])
        ], [null, null, null]), [
            faunadb_1.query.Call(index_1.indexNameNormalized("FindIndex"), [
                faunadb_1.query.Var("resource"),
                [faunadb_1.query.Concat(["term:", path_1.pathString(faunadb_1.query.Var("field"))])]
            ]),
            faunadb_1.query.Var("value"),
            faunadb_1.query.Var("field")
        ]))),
        validTermIndexes: faunadb_1.query.Filter(faunadb_1.query.Var("termIndexes"), faunadb_1.query.Lambda(["index", "value", "field"], faunadb_1.query.IsIndex(faunadb_1.query.Var("index")))),
        unvalidIndexes: faunadb_1.query.Filter(faunadb_1.query.Var("termIndexes"), faunadb_1.query.Lambda(["index", "value", "field"], faunadb_1.query.Not(faunadb_1.query.IsIndex(faunadb_1.query.Var("index"))))),
        unvalidFields: faunadb_1.query.Concat(faunadb_1.query.Map(faunadb_1.query.Var("unvalidIndexes"), faunadb_1.query.Lambda(["index", "value", "field"], faunadb_1.query.Var("field"))), ", ")
    }, faunadb_1.query.If(faunadb_1.query.LT(faunadb_1.query.Count(faunadb_1.query.Var("unvalidIndexes")), 1), faunadb_1.query.Intersection(faunadb_1.query.Map(faunadb_1.query.Var("validTermIndexes"), faunadb_1.query.Lambda(["index", "value", "field"], faunadb_1.query.Match(faunadb_1.query.Var("index"), faunadb_1.query.Var("value"))))), faunadb_1.query.Abort(faunadb_1.query.Concat([
        "Indexes couldn't be found for field(s): ",
        faunadb_1.query.Concat(faunadb_1.query.Var("unvalidFields"), ", ")
    ], " "))))))
});

},{"faunadb":11,"~/factory/classes/index":77,"~/factory/classes/udfunction":79,"~/framework/helpers/path":150}],131:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const WrapActionAndLog_1 = require("~/framework/helpers/WrapActionAndLog");
const logData_1 = require("~/framework/helpers/logData");
exports.Update = udfunction_1.UDFunction({
    name: udfunction_1.udfunctionNameNormalized("Update"),
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(["userRef", "ref", "data"], WrapActionAndLog_1.WrapActionAndLog("update", faunadb_1.query.Update(faunadb_1.query.Var("ref"), { data: logData_1.logData.update() })))),
});

},{"faunadb":11,"~/factory/classes/udfunction":79,"~/framework/helpers/WrapActionAndLog":148,"~/framework/helpers/logData":149}],132:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const fauna = require("faunadb");
const q = fauna.query;
// biota
const index_1 = require("~/factory/classes/index");
exports.indexes__by__resource = index_1.Index({
    name: index_1.indexNameNormalized('indexes__by__resource'),
    source: {
        collection: q.Indexes(),
        fields: {
            source: q.Query(q.Lambda('index', q.Let({
                source: q.Select('source', q.Var('index'), false),
                collection: q.Select('collection', q.Var('source'), false)
            }, q.If(q.IsRef(q.Var('collection')), q.Var('collection'), false))))
        }
    },
    terms: [
        {
            binding: 'source'
        }
    ],
    values: [
        {
            field: ['ref']
        }
    ]
});

},{"faunadb":11,"~/factory/classes/index":77}],133:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const fauna = require("faunadb");
const q = fauna.query;
// biota
const index_1 = require("~/factory/classes/index");
exports.indexes__by__terms = index_1.Index({
    name: index_1.indexNameNormalized('indexes__by__terms'),
    source: {
        collection: q.Indexes(),
        fields: {
            terms: q.Query(q.Lambda('index', q.Map(q.Select('terms', q.Var('index'), []), q.Lambda('term', q.If(q.Contains('binding', q.Var('term')), q.Concat(['binding:', q.Select('binding', q.Var('term'), '')], ''), q.Concat(['term:', q.Concat(q.Select('field', q.Var('term'), []), '.')], ''))))))
        }
    },
    terms: [
        {
            binding: 'terms'
        }
    ],
    values: [
        {
            field: ['ref']
        }
    ]
});

},{"faunadb":11,"~/factory/classes/index":77}],134:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const faunadb_1 = require("faunadb");
// lib
const role_1 = require("~/factory/classes/role");
const udfunction_1 = require("~/factory/classes/udfunction");
const index_1 = require("~/factory/classes/index");
exports.system = {
    name: "system",
    privileges: [
        /**
         * Indexes
         */
        role_1.Privilege({
            resource: faunadb_1.query.Indexes(),
            actions: { read: "all", unrestricted_read: "all" }
        }),
        role_1.Privilege({
            resource: faunadb_1.query.Index(index_1.indexNameNormalized("indexes__by__resource")),
            actions: { read: "all", unrestricted_read: "all" }
        }),
        role_1.Privilege({
            resource: faunadb_1.query.Index(index_1.indexNameNormalized("indexes__by__terms")),
            actions: { read: "all", unrestricted_read: "all" }
        }),
        /**
         * Functions
         */
        role_1.Privilege({
            resource: faunadb_1.query.Function(udfunction_1.udfunctionNameNormalized("FindIndex")),
            actions: { call: "all" }
        })
    ]
};

},{"faunadb":11,"~/factory/classes/index":77,"~/factory/classes/role":78,"~/factory/classes/udfunction":79}],135:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const faunadb_1 = require("faunadb");
// factory
const role_1 = require("~/factory/classes/role");
const udfunction_1 = require("~/factory/classes/udfunction");
// framework
const has_role_1 = require("~/framework/default/rules/has_role");
const wrapDoc_1 = require("~/framework/helpers/wrapDoc");
// import { is_document_available } from "~/framework/default/rules/is_document_available";
exports.user = role_1.Role({
    name: "user",
    membership: {
        resource: faunadb_1.query.Collection("users"),
        predicate: faunadb_1.query.Query(faunadb_1.query.Lambda("ref", wrapDoc_1.wrapDoc("ref", has_role_1.has_role("user"))))
    },
    privileges: [
        /**
         * Indexes
         */
        /**
         * Collections
         */
        role_1.Privilege({
            resource: faunadb_1.query.Collection("users"),
            actions: { read: "self" }
        }),
        /**
         * Functions
         */
        role_1.Privilege({
            resource: faunadb_1.query.Function(udfunction_1.udfunctionNameNormalized("SearchQuery")),
            actions: { call: "all" }
        })
    ]
});

},{"faunadb":11,"~/factory/classes/role":78,"~/factory/classes/udfunction":79,"~/framework/default/rules/has_role":138,"~/framework/helpers/wrapDoc":151}],136:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
// biota
const rule_1 = require("~/factory/rule");
exports.all = rule_1.Rule({
    name: "all",
    query: true
});

},{"~/factory/rule":87}],137:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
// biota
const rule_1 = require("~/factory/rule");
exports.are_rights_not_changed = rule_1.Rule({
    name: "are_rights_not_changed"
});

},{"~/factory/rule":87}],138:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const rule_1 = require("~/factory/rule");
exports.has_role = rule_1.RuleBuilder({
    name: "has_role",
    query: (role) => faunadb_1.query.GT(faunadb_1.query.Filter(faunadb_1.query.Select(["access", "roles"], faunadb_1.query.Var("doc"), []), faunadb_1.query.Lambda(["role"], faunadb_1.query.Equals(faunadb_1.query.Role(role), faunadb_1.query.Var("role")))), 0)
});

},{"faunadb":11,"~/factory/rule":87}],139:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
// biota
const rule_1 = require("~/factory/rule");
exports.is_activity_not_changed = rule_1.Rule({
    name: "is_activity_not_changed"
});

},{"~/factory/rule":87}],140:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const rule_1 = require("~/factory/rule");
exports.is_assignee = rule_1.Rule({
    name: "is_assignee",
    query: faunadb_1.query.Equals(faunadb_1.query.Select(["activity", "assignees"], faunadb_1.query.Var("doc"), null), faunadb_1.query.Identity())
});

},{"faunadb":11,"~/factory/rule":87}],141:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const consts_1 = require("~/consts");
const rule_1 = require("~/factory/rule");
exports.is_document_available = rule_1.Rule({
    name: "is_document_available",
    query: faunadb_1.query.Let({
        deleted_at: faunadb_1.query.Select(["data", "activity", "deleted_at"], faunadb_1.query.Var("doc"), faunadb_1.query.ToTime(consts_1.TS_2500_YEARS)),
        archived_at: faunadb_1.query.Select(["data", "activity", "archived_at"], faunadb_1.query.Var("doc"), faunadb_1.query.ToTime(consts_1.TS_2500_YEARS)),
        expired_at: faunadb_1.query.Select(["data", "activity", "expired_at"], faunadb_1.query.Var("doc"), faunadb_1.query.ToTime(consts_1.TS_2500_YEARS))
    }, faunadb_1.query.If(faunadb_1.query.LTE(faunadb_1.query.Var("deleted_at"), faunadb_1.query.Var("archived_at"), faunadb_1.query.Var("expired_at")), faunadb_1.query.Var("deleted_at"), faunadb_1.query.If(faunadb_1.query.LTE(faunadb_1.query.Var("archived_at"), faunadb_1.query.Var("expired_at"), faunadb_1.query.Var("deleted_at")), faunadb_1.query.Var("archived_at"), faunadb_1.query.Var("expired_at"))))
});

},{"faunadb":11,"~/consts":64,"~/factory/rule":87}],142:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const rule_1 = require("~/factory/rule");
exports.is_first_argument_identity = rule_1.Rule({
    name: "is_first_argument_identity",
    query: faunadb_1.query.Lambda("args", faunadb_1.query.Equals(faunadb_1.query.Select(0, faunadb_1.query.Var("args"), null), faunadb_1.query.Identity()))
});

},{"faunadb":11,"~/factory/rule":87}],143:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const rule_1 = require("~/factory/rule");
exports.is_not_assignee = rule_1.Rule({
    name: "is_not_assignee",
    query: faunadb_1.query.Not(faunadb_1.query.Equals(faunadb_1.query.Select(["activity", "assignees"], faunadb_1.query.Var("doc"), null), faunadb_1.query.Identity()))
});

},{"faunadb":11,"~/factory/rule":87}],144:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const rule_1 = require("~/factory/rule");
exports.is_not_owner = rule_1.Rule({
    name: "is_not_owner",
    query: faunadb_1.query.Not(faunadb_1.query.Equals(faunadb_1.query.Select(["activity", "owner"], faunadb_1.query.Var("doc"), null), faunadb_1.query.Identity()))
});

},{"faunadb":11,"~/factory/rule":87}],145:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const rule_1 = require("~/factory/rule");
exports.is_owner = rule_1.Rule({
    name: "is_owner",
    query: faunadb_1.query.Equals(faunadb_1.query.Select(["activity", "owner"], faunadb_1.query.Var("doc"), null), faunadb_1.query.Identity())
});

},{"faunadb":11,"~/factory/rule":87}],146:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const rule_1 = require("~/factory/rule");
exports.is_self = rule_1.Rule({
    name: "is_self",
    query: faunadb_1.query.Equals(faunadb_1.query.Var("ref"), faunadb_1.query.Identity())
});

},{"faunadb":11,"~/factory/rule":87}],147:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
// biota
const rule_1 = require("~/factory/rule");
exports.none = rule_1.Rule({
    name: "none",
    query: false
});

},{"~/factory/rule":87}],148:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const udfunction_1 = require("~/factory/classes/udfunction");
const ql_1 = require("~/factory/api/ql");
exports.WrapActionAndLog = (action, fql) => {
    return faunadb_1.query.Let({
        doc: fql,
        action: faunadb_1.query.If(faunadb_1.query.IsRef(faunadb_1.query.Select("ref", faunadb_1.query.Var("doc"), null)), faunadb_1.query.Call(udfunction_1.udfunctionNameNormalized("LogAction"), faunadb_1.query.Select("ref", faunadb_1.query.Var("doc")), faunadb_1.query.Select("ts", faunadb_1.query.Var("doc")), ql_1.Identity(), action), null)
    }, {
        doc: faunadb_1.query.Var("doc"),
        action: faunadb_1.query.Var("action")
    });
};

},{"faunadb":11,"~/factory/api/ql":70,"~/factory/classes/udfunction":79}],149:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const merge = (fieldValues, data = faunadb_1.query.Var("data")) => {
    let dataToMerge = {};
    for (let fieldName in fieldValues) {
        dataToMerge[fieldName] = faunadb_1.query.Merge(faunadb_1.query.Select(fieldName, data, {}), fieldValues[fieldName]);
    }
    return faunadb_1.query.Merge(data, dataToMerge);
};
exports.logData = {
    own() {
        return merge({
            access: {
                owner: faunadb_1.query.Var("ref")
            },
            activity: {
                owner_changed_at: faunadb_1.query.Now(),
                owner_changed_by: faunadb_1.query.Var("userRef")
            }
        });
    },
    credentials() {
        return merge({
            activity: {
                credentials_changed_by: faunadb_1.query.Var("ref"),
                credentials_changed_at: faunadb_1.query.Now()
            }
        }, {});
    },
    assign() {
        return merge({
            access: {
                assignees: faunadb_1.query.Var("ref")
            },
            activity: { assigned_by: faunadb_1.query.Var("userRef"), assigned_at: faunadb_1.query.Now() }
        });
    },
    insert() {
        return merge({
            activity: { created_by: faunadb_1.query.Var("userRef"), created_at: faunadb_1.query.Now() }
        });
    },
    update() {
        return merge({
            activity: { updated_by: faunadb_1.query.Var("userRef"), updated_at: faunadb_1.query.Now() }
        });
    },
    replace() {
        return merge({
            activity: { replaced_by: faunadb_1.query.Var("userRef"), replaced_at: faunadb_1.query.Now() }
        });
    },
    expire() {
        return merge({
            activity: { expired_by: faunadb_1.query.Var("userRef"), expired_at: faunadb_1.query.Var("at") }
        }, {});
    },
    delete() {
        return merge({
            activity: { deleted_by: faunadb_1.query.Var("userRef"), deleted_at: faunadb_1.query.Now() }
        }, {});
    },
    archive() {
        return merge({
            activity: { archived_by: faunadb_1.query.Var("userRef"), archived_at: faunadb_1.query.Now() }
        }, {});
    }
};

},{"faunadb":11}],150:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const string_split_1 = require("~/factory/ql/string_split");
function pathItems(path) {
    return faunadb_1.query.Let({
        pathArray: faunadb_1.query.If(faunadb_1.query.IsArray(path), faunadb_1.query.Map(path, faunadb_1.query.Lambda("part", faunadb_1.query.ToString(faunadb_1.query.Var("part")))), string_split_1.StringSplit(faunadb_1.query.ToString(path)))
    }, faunadb_1.query.If(faunadb_1.query.GT(faunadb_1.query.Count(faunadb_1.query.Var("pathArray")), 0), faunadb_1.query.If(faunadb_1.query.StartsWith(faunadb_1.query.Select(0, faunadb_1.query.Var("pathArray"), ""), "~"), faunadb_1.query.Drop(1, faunadb_1.query.Var("pathArray")), faunadb_1.query.Append(faunadb_1.query.Var("pathArray"), ["data"])), []));
}
exports.pathItems = pathItems;
function pathString(path) {
    return faunadb_1.query.Concat(pathItems(path), ".");
}
exports.pathString = pathString;

},{"faunadb":11,"~/factory/ql/string_split":84}],151:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
function wrapDoc(refVar, fql) {
    return faunadb_1.query.Let({
        doc: faunadb_1.query.Get(faunadb_1.query.Var(refVar))
    }, fql);
}
exports.wrapDoc = wrapDoc;

},{"faunadb":11}],152:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./api/collection"));
__export(require("./api/login"));
__export(require("./api/paginate"));
__export(require("./api/query"));
__export(require("./api/foundation"));
__export(require("./api/relation"));
// export * from "./api/graphql"
// export * from "./api/import"

},{"./api/collection":88,"./api/foundation":109,"./api/login":110,"./api/paginate":111,"./api/query":112,"./api/relation":113}],153:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("~/consts");
function stringPath(p) {
    if (Array.isArray(p)) {
        return p.map(a => `${a}`).join(".");
    }
    else if (p) {
        p = `${p}`;
        return p;
    }
    else {
        return p;
    }
}
exports.stringPath = stringPath;
function path(p) {
    let pathArray = [];
    if (Array.isArray(p)) {
        pathArray = p.map(a => `${a}`);
    }
    else if (p) {
        p = `${p}`;
        pathArray = p.split(".");
    }
    if (pathArray.length > 0) {
        if (pathArray[0].startsWith("~")) {
            pathArray[0] = pathArray[0].slice(1);
        }
        else {
            pathArray.unshift("data");
        }
    }
    return pathArray;
}
exports.path = path;
function name(texts) {
    return texts.join(consts_1.DOUBLE_SEPARATOR);
}
exports.name = name;
function nameOrOptions(text, options) {
    return typeof text === "object"
        ? text
        : {
            name: text,
            ...options
        };
}
exports.nameOrOptions = nameOrOptions;
function splitTextEvery(nb, text) {
    return `${text}`.match(new RegExp(`.{1,${nb}}`, "g"));
}
exports.splitTextEvery = splitTextEvery;
function splitEvery(nb, items) {
    let result = [];
    let index = 0;
    while (index < items.length) {
        result.push(items.slice(index, (index += nb)));
    }
    return result;
}
exports.splitEvery = splitEvery;

},{"~/consts":64}],154:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function PageInstance(page) {
    this.value = page;
    return this;
}
PageInstance.prototype.data = function () {
    return this.value.data;
};
async function Page(cursor) {
    return cursor.next().then(({ value }) => {
        if (!value) {
            return { data: [] };
        }
        else {
            return value;
        }
    });
}
exports.Page = Page;

},{}],155:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
async function execute(tasks, options) {
    let { indent = 0, singleResult = false, domain = "task" } = options || {};
    const debug = debug_1.default("biota").extend(domain);
    let indentation = "--".repeat(indent);
    let ctx = {};
    let results = [];
    for (let task of tasks) {
        debug(`${indentation} ${task.name}`);
        await new Promise((resolve, reject) => task
            .task(ctx)
            .then(resolve)
            .catch(reject))
            .then(res => results.push(res))
            .catch(error => {
            results.push({ error });
            debug(`${indentation} error: ${task.name}: ${error.message}`);
            try {
                debug(JSON.stringify(JSON.parse(error.requestResult.responseRaw), null, 2));
            }
            catch (error) {
                debug(JSON.stringify(error, null, 2));
            }
            if (task.fullError) {
                try {
                    debug(JSON.stringify(JSON.parse(error.requestResult.responseRaw), null, 2));
                }
                catch (e) {
                    debug(error);
                }
            }
        });
    }
    if (singleResult) {
        try {
            return results[0];
        }
        catch (error) {
            return {};
        }
    }
    return results;
}
exports.execute = execute;

},{"debug":8}]},{},[63]);
