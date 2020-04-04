import { DBFactoryFQLUDFGet } from "~/../types/factory/factory.fql.udf";
import { query as q } from "faunadb";
import { get as getBaseFQL } from "~/factory/api/fql/base/get";

export const get: DBFactoryFQLUDFGet = {
  document(collection, id) {
    return q.Let(
      {
        doc: getBaseFQL.document(collection, id),
      },
      q.Var("doc")
    );
  },
  collections(options) {
    return q.Let(
      {
        doc: getBaseFQL.collections(options),
      },
      q.Var("doc")
    );
  },
  index(name) {
    return q.Let(
      {
        doc: getBaseFQL.index(name),
      },
      q.Var("doc")
    );
  },
  indexes(options) {
    return q.Let(
      {
        doc: getBaseFQL.indexes(options),
      },
      q.Var("doc")
    );
  },
  udfunction(name) {
    return q.Let(
      {
        doc: getBaseFQL.udfunction(name),
      },
      q.Var("doc")
    );
  },
  udfunctions(options) {
    return q.Let(
      {
        doc: getBaseFQL.udfunctions(options),
      },
      q.Var("doc")
    );
  },
  role(name) {
    return q.Let(
      {
        doc: getBaseFQL.role(name),
      },
      q.Var("doc")
    );
  },
  roles(options) {
    return q.Let(
      {
        doc: getBaseFQL.roles(options),
      },
      q.Var("doc")
    );
  },
  keys(options) {
    return q.Let(
      {
        doc: getBaseFQL.keys(options),
      },
      q.Var("doc")
    );
  },
  tokens(options) {
    return q.Let(
      {
        doc: getBaseFQL.tokens(options),
      },
      q.Var("doc")
    );
  },
  credentials(options) {
    return q.Let(
      {
        doc: getBaseFQL.credentials(options),
      },
      q.Var("doc")
    );
  },
};
