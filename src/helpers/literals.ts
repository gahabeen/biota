export function inputStringLiteral(args: any[]): any[] {
  const arg = args[0];
  if (Array.isArray(arg) && typeof arg[0] === 'string') {
    if (arg[0].length === 0) return [null];
    return arg[0].split('/');
  } else {
    return [arg, ...args];
  }
}
