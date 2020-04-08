import { SIMPLE_SEPARATOR, DOUBLE_SEPARATOR } from "~/consts";

export function bindSubFunctions(self, rootKey) {
  const resolver = (value) => {
    let entries = Object.entries(value);
    for (let [key, entry] of entries) {
      if (typeof entry === "object") {
        value[key] = resolver(entry);
      } else if (typeof entry === "function") {
        value[key] = entry.bind(self);
      } else {
        value[key] = entry;
      }
    }
    return value;
  };
  resolver(self[rootKey] || {});
}

export function stringPath(p: string | string[]) {
  if (Array.isArray(p)) {
    return p.map((a) => `${a}`).join(".");
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
    pathArray = p.map((a) => `${a}`);
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

export function nameOrOptions(text: string | object, options: object = {}, key = "name") {
  return typeof text === "object"
    ? text
    : {
        [key]: text,
        ...options,
      };
}

export function splitTextEvery(nb: number, text: string) {
  return `${text}`.match(new RegExp(`.{1,${nb}}`, "g"));
}

export function splitEvery(nb: number, items: any[]) {
  let result = [];
  let index = 0;
  while (index < items.length) {
    result.push(items.slice(index, (index += nb)));
  }
  return result;
}
