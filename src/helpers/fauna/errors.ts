import * as util from 'util';

export function FaunaError(name: any, message: any) {
  Error.call(this);

  this.name = name;

  this.message = message;
}

util.inherits(FaunaError, Error);

export function InvalidValue(message: any) {
  FaunaError.call(this, 'InvalidValue', message);
}

util.inherits(InvalidValue, FaunaError);

export function InvalidArity(min: any, max: any, actual: any, callerFunc: any) {
  const arityInfo = `${callerFunc} export function requires ${messageForArity(min, max)} argument(s) but ${actual} were given`;
  const documentationLink = logDocumentationLink(callerFunc);

  FaunaError.call(this, 'InvalidArity', `${arityInfo}\n${documentationLink}`);

  this.min = min;

  this.max = max;

  this.actual = actual;

  function messageForArity(min: string, max: string) {
    if (max === null) return 'at least ' + min;
    if (min === null) return 'up to ' + max;
    if (min === max) return min;
    return 'from ' + min + ' to ' + max;
  }

  function logDocumentationLink(functionName: string) {
    const docsURL = 'https://docs.fauna.com/fauna/current/api/fql/functions/';
    return `For more info, see the docs: ${docsURL}${functionName.toLowerCase()}`;
  }
}

util.inherits(InvalidArity, FaunaError);

export function FaunaHTTPError(name: string, requestResult: { responseContent: any }) {
  const response = requestResult.responseContent;
  const errors = response.errors;
  const message = errors.length === 0 ? '(empty "errors")' : errors[0].code;
  FaunaError.call(this, name, message);

  this.requestResult = requestResult;
}

util.inherits(FaunaHTTPError, FaunaError);

FaunaHTTPError.prototype.errors = function () {
  return this.requestResult.responseContent.errors;
};

FaunaHTTPError.raiseForStatusCode = (requestResult: { statusCode: any }) => {
  const code = requestResult.statusCode;
  if (code < 200 || code >= 300) {
    switch (code) {
      case 400:
        throw new BadRequest(requestResult);
      case 401:
        throw new Unauthorized(requestResult);
      case 403:
        throw new PermissionDenied(requestResult);
      case 404:
        throw new NotFound(requestResult);
      case 405:
        throw new MethodNotAllowed(requestResult);
      case 500:
        throw new InternalError(requestResult);
      case 503:
        throw new UnavailableError(requestResult);
      default:
        throw new FaunaHTTPError('UnknownError', requestResult as any);
    }
  }
};

export function BadRequest(requestResult: any) {
  FaunaHTTPError.call(this, 'BadRequest', requestResult);
}

util.inherits(BadRequest, FaunaHTTPError);

export function Unauthorized(requestResult: any) {
  FaunaHTTPError.call(this, 'Unauthorized', requestResult);
}

util.inherits(Unauthorized, FaunaHTTPError);

export function PermissionDenied(requestResult: any) {
  FaunaHTTPError.call(this, 'PermissionDenied', requestResult);
}

util.inherits(PermissionDenied, FaunaHTTPError);

export function NotFound(requestResult: any) {
  FaunaHTTPError.call(this, 'NotFound', requestResult);
}

util.inherits(NotFound, FaunaHTTPError);

export function MethodNotAllowed(requestResult: any) {
  FaunaHTTPError.call(this, 'MethodNotAllowed', requestResult);
}

util.inherits(MethodNotAllowed, FaunaHTTPError);

export function InternalError(requestResult: any) {
  FaunaHTTPError.call(this, 'InternalError', requestResult);
}

util.inherits(InternalError, FaunaHTTPError);

export function UnavailableError(requestResult: any) {
  FaunaHTTPError.call(this, 'UnavailableError', requestResult);
}

util.inherits(UnavailableError, FaunaHTTPError);
