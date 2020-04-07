import { DBFactoryFQLUDFReplace } from "~/../types/factory/factory.fql.udf";
import { query as q } from "faunadb";
import { replace as replacebaseFQL } from "~/factory/api/fql/base/replace";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { CallLogAction, CallSystemOperator } from "~/framework/helpers/WrapActionAndLog";
import { DOCUMENT_RESERVED_DATA_FIELDS_OBJ } from "~/consts";

let replaceLogData = {
  _activity: { replaced_by: q.Var("identity"), replaced_at: q.Now() },
};

export const replace: DBFactoryFQLUDFReplace = {
  document(collection, id, data = {}) {
    return q.Let(
      {
        safeData: q.Merge(data, DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        doc: replacebaseFQL.document(collection, id, q.Var("safeData")),
        operation: CallSystemOperator(updateBaseFQL.document(collection, q.Select(["ref", "id"], q.Var("doc")), replaceLogData)),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  database(name, options = {}) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", options, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(options, { data: q.Var("safeData") }),
        doc: replacebaseFQL.database(name, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.database(name, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  collection(name, options = {}) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", options, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(options, { data: q.Var("safeData") }),
        doc: replacebaseFQL.collection(name, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.collection(name, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  index(name, options = {}) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", options, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(options, { data: q.Var("safeData") }),
        doc: replacebaseFQL.index(name, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.index(name, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  udfunction(name, options = {}) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", options, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(options, { data: q.Var("safeData") }),
        doc: replacebaseFQL.udfunction(name, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.udfunction(name, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  role(name, options = {}) {
    return q.Let(
      {
        doc: replacebaseFQL.role(name, options),
        // operation: CallSystemOperator(updateBaseFQL.role(name, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  token(id, options = {}) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", options, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(options, { data: q.Var("safeData") }),
        doc: replacebaseFQL.token(id, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.token(id, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  key(id, options = {}) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", options, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(options, { data: q.Var("safeData") }),
        doc: replacebaseFQL.key(id, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.key(id, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
};
