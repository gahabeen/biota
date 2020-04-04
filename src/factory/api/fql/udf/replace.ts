import { DBFactoryFQLUDFReplace } from "~/../types/factory/factory.fql.udf";
import { query as q } from "faunadb";
import { replace as replacebaseFQL } from "~/factory/api/fql/base/replace";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { CallLogAction, CallSystemOperator } from "~/framework/helpers/WrapActionAndLog";

let replaceLogData = {
  activity: { replaced_by: q.Var("identity"), replaced_at: q.Now() },
};

export const replace: DBFactoryFQLUDFReplace = {
  document(collection, id, options) {
    return q.Let(
      {
        doc: replacebaseFQL.document(collection, id, options),
        operation: CallSystemOperator(updateBaseFQL.document(collection, q.Select(["ref", "id"], q.Var("doc")), { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  database(name, options) {
    return q.Let(
      {
        doc: replacebaseFQL.database(name, options),
        operation: CallSystemOperator(updateBaseFQL.database(name, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  collection(name, options) {
    return q.Let(
      {
        doc: replacebaseFQL.collection(name, options),
        operation: CallSystemOperator(updateBaseFQL.collection(name, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  index(name, options) {
    return q.Let(
      {
        doc: replacebaseFQL.index(name, options),
        operation: CallSystemOperator(updateBaseFQL.index(name, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  udfunction(name, options) {
    return q.Let(
      {
        doc: replacebaseFQL.udfunction(name, options),
        operation: CallSystemOperator(updateBaseFQL.udfunction(name, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  role(name, options) {
    return q.Let(
      {
        doc: replacebaseFQL.role(name, options),
        // operation: CallSystemOperator(updateBaseFQL.role(name, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  token(id, options) {
    return q.Let(
      {
        doc: replacebaseFQL.token(id, options),
        operation: CallSystemOperator(updateBaseFQL.token(id, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  key(id, options) {
    return q.Let(
      {
        doc: replacebaseFQL.key(id, options),
        operation: CallSystemOperator(updateBaseFQL.key(id, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
};
