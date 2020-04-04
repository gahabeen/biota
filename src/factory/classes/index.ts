import { query as q } from "faunadb";
import { Fauna, FaunaIndexOptions } from "~/../types/fauna";

export function indexNameNormalized(name: string) {
  return `biota.${name.replace("biota.", "")}`;
}

export function Index(index: FaunaIndexOptions): FaunaIndexOptions {
  let {
    name,
    source = {
      collection: undefined,
      fields: {},
    },
    terms = [],
    values = [],
    unique = false,
    serialized = true,
    permissions = {},
    data = {},
  } = index || {};

  let self = {
    name,
    source,
    terms,
    values,
    unique,
    serialized,
    permissions,
    data,
  };

  return self;
}

export function Cursor(pathArray: string | string[]) {
  return q.Query(q.Lambda("doc", q.Select(pathArray, q.Var("doc"), Infinity)));
}

export function ToCursor(index: FaunaIndexOptions): FaunaIndexOptions {
  const { name, source = {}, terms = [] } = index || {};
  let pathArray;
  try {
    pathArray = terms[0].field;
  } catch (error) {
    pathArray = undefined;
  }
  if (pathArray) {
    return {
      name,
      source: {
        ...source,
        fields: {
          cursor: Cursor(pathArray),
        },
      },
      values: [{ binding: "cursor" }, { field: ["ref"] }],
    };
  } else {
    return undefined;
  }
}

export function ToReverse(index: FaunaIndexOptions): FaunaIndexOptions {
  let { terms, data } = index || {};
  let [firstTerm = {}, ...otherTerms] = terms || [];
  firstTerm.reverse = true;
  return {
    ...index,
    name: `${index.name}__reverse`,
    terms: [firstTerm, ...otherTerms],
    data: { ...data, reverse: true },
  };
}

export function NGramOnField(depth: number = 10, field: string[]): Fauna.Expr {
  return q.Union(
    q.Map(
      new Array(depth).fill(null).map((_, i) => i + 1),
      q.Lambda("min", q.NGram(q.LowerCase(q.Select(field, q.Var("instance"))), q.Var("min"), q.Add(1, q.Var("min"))))
    )
  );
}

export function SearchIndex(collection: string, depth: number = 10, fields: string[][]): Fauna.Expr {
  return Index({
    name: `${collection}__search_on__${fields.map((field) => field.join("_")).join("_and_")}`,
    source: {
      collection: q.Collection(collection),
      fields: {
        search: q.Query(q.Lambda("instance", q.Distinct(q.Union(fields.map((field) => NGramOnField(depth, field)))))),
      },
    },
    terms: [{ binding: "search" }],
  });
}
