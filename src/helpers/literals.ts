export function inputStringLiteral(arg: any, ...args: any[]): any[] {
  if (Array.isArray(arg) && typeof arg?.[0]?.[0] === 'string') {
    return arg[0][0].split('/');
  } else {
    return [arg, ...args];
  }
}
