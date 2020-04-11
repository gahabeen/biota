import { values, Expr } from 'faunadb';

const ctors = {
  classes: 'Class',
  collections: 'Collection',
  indexes: 'Index',
  databases: 'Database',
  keys: 'Key',
  roles: 'Role',
};

const parseRef = (obj) => {
  if (obj === undefined) {
    return obj;
  } else if (obj instanceof values.Ref) {
    return obj;
  } else {
    const ref = '@ref' in obj ? obj['@ref'] : obj;
    return new values.Ref(ref.id, parseRef(ref.collection), parseRef(ref.database));
  }
};

const renderRef = (obj) => {
  let args = [`"${obj.id}"`];

  if (obj.collection !== undefined) {
    const ctor = ctors[obj.collection.id];
    if (ctor !== undefined) {
      if (obj.database !== undefined) args.push(renderRef(obj.database));
      args = (args.join(', ') as unknown) as string[];
      return `${ctor}(${args})`;
    }
  }

  if (obj.collection !== undefined) args = [renderRef(obj.collection)].concat(args);
  args = (args.join(', ') as unknown) as string[];
  return `Ref(${args})`;
};

const renderSpecialType = (type) => {
  if (!type) return null;

  if (type instanceof values.Value) {
    if (type instanceof values.Ref) return renderRef(type);
    if (type instanceof values.FaunaTime) return `Time("${type.toString()}")`;
    if (type instanceof values.FaunaDate) return `Date("${type.toString()}")`;
    if (type instanceof values.Query) return `Query(${Expr.toString(type.toString())})`;
    return null;
  }

  if (typeof type === 'object' && !Array.isArray(type)) {
    const keys = Object.keys(type);

    switch (keys[0]) {
      case '@ref':
        return renderRef(parseRef(type));
      case '@ts':
        return renderSpecialType(new values.FaunaTime(type['@ts']));
      case '@date':
        return renderSpecialType(new values.FaunaDate(type['@date']));
      case '@code':
        return type['@code'];
      case '@query':
        return renderSpecialType(new values.Query(type['@query']));
      default:
        return null;
    }
  }

  return null;
};

export const stringify = (obj) => {
  const replacements = [];

  let string = JSON.stringify(
    obj,
    (key, value) => {
      const parsed = renderSpecialType(value);

      if (parsed) {
        const placeHolder = '$$dash_replacement_$' + replacements.length + '$$';
        replacements.push(parsed);
        return placeHolder;
      }

      return value;
    },
    2,
  );

  replacements.forEach((replace, index) => {
    string = string.replace('"$$dash_replacement_$' + index + '$$"', replace);
  });

  if (string) {
    string = string.replace(/\(null\)/g, '()');
  }

  return string;
};
