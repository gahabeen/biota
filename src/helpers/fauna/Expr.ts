export function Expr(obj: any) {
  this.raw = obj;
}

Expr.prototype.toJSON = function () {
  return this.raw;
};

const varArgsFunctions = [
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
];
const specialCases = {
  is_nonempty: 'is_non_empty',
  lt: 'LT',
  lte: 'LTE',
  gt: 'GT',
  gte: 'GTE',
};

const exprToString = (expr: { [x: string]: any; toString?: any; raw?: any; let?: any; in?: any; object?: any }, caller?: string) => {
  if (expr instanceof Expr) {
    if ('value' in expr) return expr.toString();

    expr = expr.raw;
  }

  const type = typeof expr;

  if (type === 'string') {
    return JSON.stringify(expr);
  }

  if (type === 'symbol' || type === 'number' || type === 'boolean') {
    return expr.toString();
  }

  if (type === 'undefined') {
    return 'undefined';
  }

  if (expr === null) {
    return 'null';
  }

  const printObject = (obj: { [x: string]: any }) => {
    return (
      '{' +
      Object.keys(obj)
        .map((k) => {
          return k + ': ' + exprToString(obj[k]);
        })
        .join(', ') +
      '}'
    );
  };

  // tslint:disable-next-line: unified-signatures
  const printArray = (array: any[], toStr: { (expr: any, caller: any): any; (obj: any): any; (arg0: any): any }) => {
    return array
      .map((item: any) => {
        return toStr(item);
      })
      .join(', ');
  };

  if (Array.isArray(expr)) {
    const array = printArray(expr, exprToString);

    return varArgsFunctions.indexOf(caller) !== -1 ? array : '[' + array + ']';
  }

  if ('let' in expr && 'in' in expr) {
    let letExpr = '';

    if (Array.isArray(expr.let)) letExpr = '[' + printArray(expr.let, printObject) + ']';
    else letExpr = printObject(expr.let);

    return 'Let(' + letExpr + ', ' + exprToString(expr.in) + ')';
  }

  if ('object' in expr) return printObject(expr.object);

  const keys = Object.keys(expr);
  let fn = keys[0];

  if (fn in specialCases) fn = specialCases[fn];

  fn = fn
    .split('_')
    .map((str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    })
    .join('');

  let args = keys.map((k) => {
    const v = expr[k];
    return exprToString(v, fn);
  });

  const shouldReverseArgs = ['filter', 'map', 'foreach'].some((fn) => {
    return fn in expr;
  });

  if (shouldReverseArgs) {
    args.reverse();
  }

  args = args.join(', ');

  return fn + '(' + args + ')';
};

Expr.toString = exprToString;
