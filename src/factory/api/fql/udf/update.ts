import { query as q } from "faunadb";
import { DBFactoryFQLUDFUpdate } from "~/../types/factory/factory.fql.udf";
import { FaunaIndexOptions, FaunaRoleOptions } from "~/../types/fauna";
import { nameOrOptions } from "~/helpers";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { CallLogAction, CallSystemOperator } from "~/framework/helpers/WrapActionAndLog";

let updateLogData = {
  activity: { credentials_changed_by: q.Var("identity"), credentials_changed_at: q.Now() },
};

export const update: DBFactoryFQLUDFUpdate = {
  credentials(collection, id, credentials) {
    return q.Let(
      {
        doc: updateBaseFQL.credentials(collection, id, credentials),
        operation: CallSystemOperator(updateBaseFQL.document(collection, q.Select(["ref", "id"], q.Var("doc")), { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  document(collection, id, data) {
    return q.Let(
      {
        doc: updateBaseFQL.document(collection, id, data),
        operation: CallSystemOperator(updateBaseFQL.document(collection, q.Select(["ref", "id"], q.Var("doc")), { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  database(name, options) {
    return q.Let(
      {
        doc: updateBaseFQL.database(name, options),
        operation: CallSystemOperator(updateBaseFQL.database(name, { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  collection(name, options) {
    return q.Let(
      {
        doc: updateBaseFQL.collection(name, options),
        operation: CallSystemOperator(updateBaseFQL.collection(name, { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  index(name, options: FaunaIndexOptions = {}) {
    return q.Let(
      {
        doc: updateBaseFQL.index(name, options),
        operation: CallSystemOperator(updateBaseFQL.index(name, { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  udfunction(name, options) {
    return q.Let(
      {
        doc: updateBaseFQL.udfunction(name, options),
        operation: CallSystemOperator(updateBaseFQL.udfunction(name, { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  role(name, options = {}) {
    return q.Let(
      {
        doc: updateBaseFQL.role(name, options),
        // operation: CallSystemOperator(updateBaseFQL.role(name, { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  token(id, options) {
    return q.Let(
      {
        doc: updateBaseFQL.token(id, options),
        operation: CallSystemOperator(updateBaseFQL.token(id, { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  key(id, options) {
    return q.Let(
      {
        doc: updateBaseFQL.key(id, options),
        operation: CallSystemOperator(updateBaseFQL.key(id, { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
};
