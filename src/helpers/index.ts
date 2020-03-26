import { SIMPLE_SEPARATOR, DOUBLE_SEPARATOR } from "~/consts";

export function stringPath(p: string | string[]) {
  if (Array.isArray(p)) {
    return p.map(a => `${a}`).join(".");
  } else if (p) {
    p = `${p}`;
    return p;
  } else {
    return p;
  }
}

export function path(p: string | string[]) {
  let pathArray = [];
  if (Array.isArray(p)) {
    pathArray = p.map(a => `${a}`);
  } else if (p) {
    p = `${p}`;
    pathArray = p.split(".");
  }

  if (pathArray.length > 0) {
    if (pathArray[0].startsWith("~")) {
      pathArray[0] = pathArray[0].slice(1);
    } else {
      pathArray.unshift("data");
    }
  }
  return pathArray;
}

export function name(texts: string[]) {
  return texts.join(DOUBLE_SEPARATOR);
}

export function nameOrOptions(text: string | object, options: object) {
  return typeof text === "object"
    ? text
    : {
        name: text,
        ...options
      };
}
