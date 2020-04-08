import { query as q } from "faunadb";
import { DBFactoryFQLUDFUpdate } from "~/../types/factory/factory.fql.udf";
import { FaunaIndexOptions } from "~/../types/fauna";
import { DOCUMENT_RESERVED_DATA_FIELDS_OBJ } from "~/consts";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { CallLogAction, CallSystemOperator, CallIsPrivateKeyValid } from "~/framework/helpers/call_functions";

let updateCredentialsLogData = {
  _activity: { credentials_changed_by: q.Var("identity"), credentials_changed_at: q.Now() },
};

let updateLogData = {
  _activity: { updated_by: q.Var("identity"), updated_at: q.Now() },
};

export const update: DBFactoryFQLUDFUpdate = {
  credentials(collection, id, credentials = {}) {
    return q.Let(
      {

        doc: updateBaseFQL.credentials(collection, id, credentials),
        operation: CallSystemOperator(updateBaseFQL.document(collection, q.Select(["ref", "id"], q.Var("doc")), updateCredentialsLogData)),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  document(collection, id, data = {}) {
    return q.Let(
      {

        safeData: q.Merge(data, DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        doc: updateBaseFQL.document(collection, id, q.Var("safeData")),
        operation: CallSystemOperator(updateBaseFQL.document(collection, q.Select(["ref", "id"], q.Var("doc")), updateLogData)),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  database(name, options = {}) {
    return q.Let(
      {

        safeData: q.Merge(q.Select("data", options, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(options, { data: q.Var("safeData") }),
        doc: updateBaseFQL.database(name, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.database(name, { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  collection(name, options = {}) {
    return q.Let(
      {

        safeData: q.Merge(q.Select("data", options, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(options, { data: q.Var("safeData") }),
        doc: updateBaseFQL.collection(name, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.collection(name, { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  index(name, options: FaunaIndexOptions = {}) {
    return q.Let(
      {

        safeData: q.Merge(q.Select("data", options, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(options, { data: q.Var("safeData") }),
        doc: updateBaseFQL.index(name, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.index(name, { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  udfunction(name, options = {}) {
    return q.Let(
      {

        safeData: q.Merge(q.Select("data", options, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(options, { data: q.Var("safeData") }),
        doc: updateBaseFQL.udfunction(name, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.udfunction(name, { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("operation")
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
  token(id, options = {}) {
    return q.Let(
      {

        safeData: q.Merge(q.Select("data", options, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(options, { data: q.Var("safeData") }),
        doc: updateBaseFQL.token(id, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.token(id, { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  key(id, options = {}) {
    return q.Let(
      {

        safeData: q.Merge(q.Select("data", options, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(options, { data: q.Var("safeData") }),
        doc: updateBaseFQL.key(id, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.key(id, { data: updateLogData })),
        action: CallLogAction("update", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
};
