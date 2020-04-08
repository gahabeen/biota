import { query as q } from "faunadb";
import { DBFactoryFQLUDFDelete } from "~/../types/factory/factory.fql.udf";
import { delete_ as deleteBaseFQL } from "~/factory/api/fql/base/delete";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { CallLogAction, CallSystemOperator } from "~/framework/helpers/call_functions";

let deleteLogData = {
  _activity: {
    deleted_by: {
      _activity: { deleted_by: q.Var("identity"), deleted_at: q.Now() },
    },
    deleted_at: q.Now(),
  },
};

export const delete_: DBFactoryFQLUDFDelete = {
  document(collection, id) {
    return q.Let(
      {
        doc: deleteBaseFQL.document(collection, id),
        operation: CallSystemOperator(updateBaseFQL.document(collection, id, deleteLogData)),
        action: CallLogAction("delete", q.Var("doc")),
      },
      q.Var("operation")
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
      q.Var("operation")
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
      q.Var("operation")
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
      q.Var("operation")
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
      q.Var("operation")
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
        doc: deleteBaseFQL.token(id),
        operation: CallSystemOperator(updateBaseFQL.token(id, { data: deleteLogData })),
        action: CallLogAction("delete", q.Var("doc")),
      },
      q.Var("operation")
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
      q.Var("operation")
    );
  },
};
