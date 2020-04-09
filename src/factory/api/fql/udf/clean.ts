import { DBFactoryFQLUDFClean } from "~/../types/factory/factory.fql.udf";
import { query as q } from "faunadb";
import { CallLogAction, CallSystemOperator, CallIsPrivateKeyValid } from "~/framework/helpers/call_functions";
import { clean as cleanBaseFQL } from "~/factory/api/fql/base/clean";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";

let forgotLogData = {
  _activity: { forgotten_by: q.Var("identity"), forgotten_at: q.Now() },
};

export const clean: DBFactoryFQLUDFClean = {
  document(collection, id) {
    return q.Let(
      {

        operation: CallSystemOperator(updateBaseFQL.document(collection, id, forgotLogData)),
        doc: cleanBaseFQL.document(collection, id),
        action: CallLogAction("forget", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  documents(collection) {
    return q.Let(
      {
        doc: cleanBaseFQL.documents(collection),
      },
      q.Var("doc")
    );
  },
  database(name) {
    return q.Let(
      {

        operation: CallSystemOperator(updateBaseFQL.database(name, { data: forgotLogData })),
        doc: cleanBaseFQL.database(name),
        action: CallLogAction("forget", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  databases() {
    return q.Let(
      {
        doc: cleanBaseFQL.databases(),
      },
      q.Var("doc")
    );
  },
  collection(name) {
    return q.Let(
      {

        operation: CallSystemOperator(updateBaseFQL.collection(name, { data: forgotLogData })),
        doc: cleanBaseFQL.collection(name),
        action: CallLogAction("forget", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  collections() {
    return q.Let(
      {
        doc: cleanBaseFQL.collections(),
      },
      q.Var("doc")
    );
  },
  index(name) {
    return q.Let(
      {

        operation: CallSystemOperator(updateBaseFQL.index(name, { data: forgotLogData })),
        doc: cleanBaseFQL.index(name),
        action: CallLogAction("forget", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  indexes() {
    return q.Let(
      {
        doc: cleanBaseFQL.indexes(),
      },
      q.Var("doc")
    );
  },
  udfunction(name) {
    return q.Let(
      {
        // #improve

        operation: CallSystemOperator(updateBaseFQL.udfunction(name, { data: forgotLogData })),
        doc: cleanBaseFQL.udfunction(name),
        action: CallLogAction("forget", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  udfunctions() {
    return q.Let(
      {
        doc: cleanBaseFQL.udfunctions(),
      },
      q.Var("doc")
    );
  },
  role(name) {
    return q.Let(
      {
        // #improve
        // operation: CallSystemOperator(updateBaseFQL.role(name, { data: forgotLogData })),
        doc: cleanBaseFQL.role(name),
        action: CallLogAction("forget", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  roles() {
    return q.Let(
      {
        doc: cleanBaseFQL.roles(),
      },
      q.Var("doc")
    );
  },
  token(id) {
    return q.Let(
      {

        operation: CallSystemOperator(updateBaseFQL.token(id, { data: forgotLogData })),
        doc: cleanBaseFQL.token(id),
        action: CallLogAction("forget", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  tokens() {
    return q.Let(
      {
        doc: cleanBaseFQL.tokens(),
      },
      q.Var("doc")
    );
  },
  key(id) {
    return q.Let(
      {

        operation: CallSystemOperator(updateBaseFQL.key(id, { data: forgotLogData })),
        doc: cleanBaseFQL.key(id),
        action: CallLogAction("forget", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  keys() {
    return q.Let(
      {
        doc: cleanBaseFQL.keys(),
      },
      q.Var("doc")
    );
  },
};
