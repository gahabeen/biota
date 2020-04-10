export var stringify = function (a: { [x: string]: any }) {
  var prefix: string | number,
    s: any[],
    add: { (arg0: any, arg1: any): void; (key: any, value: any): void },
    name: string | number,
    r20: RegExp,
    output: any;
  s = [];
  r20 = /%20/g;
  add = function (key: string | number | boolean, value: string | number | boolean) {
    // If value is a function, invoke it and return its value
    value = typeof value == "function" ? (value as any)() : value == null ? "" : value;
    s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
  };
  if (a instanceof Array) {
    for (name in a) {
      add(name, a[name]);
    }
  } else {
    for (prefix in a) {
      buildParams(prefix, a[prefix], add);
    }
  }
  output = s.join("&").replace(r20, "+");
  return output;
};

function buildParams(prefix: string, obj: string | any[], add: (arg0: any, arg1: any) => void) {
  var name: string, i: number, l: number, rbracket: RegExp;
  rbracket = /\[\]$/;
  if (obj instanceof Array) {
    for (i = 0, l = obj.length; i < l; i++) {
      if (rbracket.test(prefix)) {
        add(prefix, obj[i]);
      } else {
        buildParams(prefix + "[" + (typeof obj[i] === "object" ? i : "") + "]", obj[i], add);
      }
    }
  } else if (typeof obj == "object") {
    // Serialize object item.
    for (name in obj as any) {
      buildParams(prefix + "[" + name + "]", obj[name], add);
    }
  } else {
    // Serialize scalar item.
    add(prefix, obj);
  }
}
