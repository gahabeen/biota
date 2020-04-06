import { query as q } from "faunadb";
import { DBFactoryFQLBaseClean } from "~/../types/factory/factory.fql.base";
import { PAGINATION_SIZE_MAX } from "~/consts";
import { forget } from "./forget";

export const clean: DBFactoryFQLBaseClean = {
  document(collection, id) {
    return q.If(
      q.Exists(q.Ref(q.Collection(collection), id)),
      {
        document: forget.document(collection, id),
        cleaned: true,
      },
      { ref: q.Ref(q.Collection(collection), id), cleaned: false }
    );
  },
  documents(collection) {
    return q.Let(
      {
        documents: q.Map(q.Paginate(q.Documents(q.Collection(collection)), { size: PAGINATION_SIZE_MAX }), (x) => q.Delete(x)),
        cleaned: q.GT(q.Count(q.Var("documents")), 0),
      },
      {
        documents: q.Var("documents"),
        cleaned: q.Var("cleaned"),
      }
    );
  },
  database(name) {
    return q.If(
      q.Exists(q.Database(name)),
      {
        database: forget.database(name),
        cleaned: true,
      },
      { ref: q.Database(name), cleaned: false }
    );
  },
  databases() {
    return q.If(
      q.GT(q.Count(q.Databases()), 0),
      {
        databases: q.Map(q.Paginate(q.Databases(), { size: PAGINATION_SIZE_MAX }), (x) => q.Delete(x)),
        cleaned: true,
      },
      { ref: q.Databases(), cleaned: false }
    );
  },
  collection(name) {
    return q.If(
      q.Exists(q.Collection(name)),
      {
        collection: forget.collection(name),
        cleaned: true,
      },
      { ref: q.Collection(name), cleaned: false }
    );
  },
  collections() {
    return q.If(
      q.GT(q.Count(q.Collections()), 0),
      {
        collections: q.Map(q.Paginate(q.Collections(), { size: PAGINATION_SIZE_MAX }), (x) => q.Delete(x)),
        cleaned: true,
      },
      { ref: q.Collections(), cleaned: false }
    );
  },
  index(name) {
    return q.If(
      q.Exists(q.Index(name)),
      {
        index: forget.index(name),
        cleaned: true,
      },
      { ref: q.Index(name), cleaned: false }
    );
  },
  indexes() {
    return q.If(
      q.GT(q.Count(q.Indexes()), 0),
      {
        indexes: q.Map(q.Paginate(q.Indexes(), { size: PAGINATION_SIZE_MAX }), (x) => q.Delete(x)),
        cleaned: true,
      },
      { ref: q.Indexes(), cleaned: false }
    );
  },
  udfunction(name) {
    return q.If(
      q.Exists(q.Function(name)),
      {
        udfunction: forget.udfunction(name),
        cleaned: true,
      },
      { ref: q.Function(name), cleaned: false }
    );
  },
  udfunctions() {
    return q.If(
      q.GT(q.Count(q.Functions()), 0),
      {
        udfunctions: q.Map(q.Paginate(q.Functions(), { size: PAGINATION_SIZE_MAX }), (x) => q.Delete(x)),
        cleaned: true,
      },
      { ref: q.Functions(), cleaned: false }
    );
  },
  role(name) {
    return q.If(
      q.Exists(q.Role(name)),
      {
        role: forget.role(name),
        cleaned: true,
      },
      { ref: q.Role(name), cleaned: false }
    );
  },
  roles() {
    return q.If(
      q.GT(q.Count(q.Roles()), 0),
      {
        roles: q.Map(q.Paginate(q.Roles(), { size: PAGINATION_SIZE_MAX }), (x) => q.Delete(x)),
        cleaned: true,
      },
      { ref: q.Roles(), cleaned: false }
    );
  },
  token(id) {
    return q.If(
      q.Exists(q.Ref(q.Tokens(), id)),
      {
        token: forget.token(id),
        cleaned: true,
      },
      { ref: q.Ref(q.Tokens(), id), cleaned: false }
    );
  },
  tokens() {
    return q.If(
      q.GT(q.Count(q.Tokens()), 0),
      {
        tokens: q.Map(q.Paginate(q.Documents(q.Tokens()), { size: PAGINATION_SIZE_MAX }), (x) => q.Delete(x)),
        cleaned: true,
      },
      { ref: q.Documents(q.Tokens()), cleaned: false }
    );
  },
  key(id) {
    return q.If(
      q.Exists(q.Ref(q.Keys(), id)),
      {
        key: forget.key(id),
        cleaned: true,
      },
      { ref: q.Ref(q.Keys(), id), cleaned: false }
    );
  },
  keys() {
    return q.If(
      q.GT(q.Count(q.Keys()), 0),
      {
        keys: q.Map(q.Paginate(q.Keys(), { size: PAGINATION_SIZE_MAX }), (x) => q.Delete(x)),
        cleaned: true,
      },
      { ref: q.Keys(), cleaned: false }
    );
  },
};
