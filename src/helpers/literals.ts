export function inputStringLiteral(args: any[]): any[] {
  const arg = args[0];
  if (Array.isArray(arg) && typeof arg?.[0]?.[0] === 'string') {
    return arg[0][0].split('/');
  } else {
    return [arg, ...args];
  }
}
