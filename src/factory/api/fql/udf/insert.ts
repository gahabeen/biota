import { query as q } from "faunadb";
import { DBFactoryFQLUDFInsert } from "~/../types/factory/factory.fql.udf";
import { insert as insertBaseFQL } from "~/factory/api/fql/base/insert";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { CallLogAction, CallSystemOperator } from "~/framework/helpers/WrapActionAndLog";

let insertLogData = {
  activity: { created_by: q.Var("identity"), created_at: q.Now() },
};

export const insert: DBFactoryFQLUDFInsert = {
  document(collection, options = {}, id) {
    return q.Let(
      {
        doc: insertBaseFQL.document(collection, options, id),
        operation: CallSystemOperator(updateBaseFQL.document(collection, q.Select(["ref", "id"], q.Var("doc")), { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  database(name, options = {}) {
    return q.Let(
      {
        doc: insertBaseFQL.database(name, options),
        operation: CallSystemOperator(updateBaseFQL.database(q.Select("name", q.Var("doc")) as string, { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  collection(name, options = {}) {
    return q.Let(
      {
        doc: insertBaseFQL.collection(name, options),
        operation: CallSystemOperator(updateBaseFQL.collection(q.Select("name", q.Var("doc")) as string, { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  index(name, options = {}) {
    return q.Let(
      {
        doc: insertBaseFQL.index(name, options),
        operation: CallSystemOperator(updateBaseFQL.index(q.Select("name", q.Var("doc")) as string, { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  udfunction(name, options = {}) {
    return q.Let(
      {
        doc: insertBaseFQL.udfunction(name, options),
        operation: CallSystemOperator(updateBaseFQL.udfunction(q.Select("name", q.Var("doc")) as string, { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  role(name, options = {}) {
    return q.Let(
      {
        doc: insertBaseFQL.role(name, options),
        // operation: CallSystemOperator(updateBaseFQL.role(q.Select("name", q.Var("doc")) as string, { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  token(ref, options = {}) {
    return q.Let(
      {
        doc: insertBaseFQL.token(ref, options),
        operation: CallSystemOperator(updateBaseFQL.token(q.Select("id", q.Var("doc")), { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  key(name, options) {
    return q.Let(
      {
        doc: insertBaseFQL.key(name, options),
        operation: CallSystemOperator(updateBaseFQL.key(q.Select("id", q.Var("doc")), { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
};
