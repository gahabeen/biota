import { DBFactoryFQLUDFDelete } from "~/../types/factory/factory.fql.udf";
import { query as q, Expr } from "faunadb";
import { CallLogAction, CallSystemOperator } from "~/framework/helpers/WrapActionAndLog";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { delete_ as deleteBaseFQL } from "~/factory/api/fql/base/delete";

let deleteLogData = {
  activity: {
    deleted_by: {
      activity: { deleted_by: q.Var("identity"), deleted_at: q.Now() },
    },
    deleted_at: q.Now(),
  },
};

export const delete_: DBFactoryFQLUDFDelete = {
  document(collection, id) {
    return q.Let(
      {
        doc: deleteBaseFQL.document(collection, id),
        operation: CallSystemOperator(updateBaseFQL.document(collection, id, { data: deleteLogData })),
        action: CallLogAction("delete", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  database(name) {
    return q.Let(
      {
        // #improve
        doc: deleteBaseFQL.database(name),
        operation: CallSystemOperator(updateBaseFQL.database(name, { data: deleteLogData })),
        action: CallLogAction("delete", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  collection(name) {
    return q.Let(
      {
        // #improve
        doc: deleteBaseFQL.collection(name),
        operation: CallSystemOperator(updateBaseFQL.collection(name, { data: deleteLogData })),
        action: CallLogAction("delete", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  index(name) {
    return q.Let(
      {
        // #improve
        doc: deleteBaseFQL.index(name),
        operation: CallSystemOperator(updateBaseFQL.index(name, { data: deleteLogData })),
        action: CallLogAction("delete", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  udfunction(name) {
    return q.Let(
      {
        // #improve
        doc: deleteBaseFQL.udfunction(name),
        operation: CallSystemOperator(updateBaseFQL.udfunction(name, { data: deleteLogData })),
        action: CallLogAction("delete", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  role(name) {
    return q.Let(
      {
        // #improve
        doc: deleteBaseFQL.role(name),
        // operation: CallSystemOperator(updateBaseFQL.role(name, { data: deleteLogData })),
        action: CallLogAction("delete", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  token(id) {
    return q.Let(
      {
        // #improve
        doc: deleteBaseFQL.token(name),
        operation: CallSystemOperator(updateBaseFQL.token(id, { data: deleteLogData })),
        action: CallLogAction("delete", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  key(id) {
    return q.Let(
      {
        // #improve
        doc: deleteBaseFQL.key(id),
        operation: CallSystemOperator(updateBaseFQL.key(id, { data: deleteLogData })),
        action: CallLogAction("delete", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
};
