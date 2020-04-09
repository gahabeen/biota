import { DBFactoryFQLUDFReplace } from "~/../types/factory/factory.fql.udf";
import { query as q } from "faunadb";
import { replace as replacebaseFQL } from "~/factory/api/fql/base/replace";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { CallLogAction, CallSystemOperator, CallIsPrivateKeyValid } from "~/framework/helpers/call_functions";
import { DOCUMENT_RESERVED_DATA_FIELDS_OBJ } from "~/consts";

let replaceLogData = {
  _activity: { replaced_by: q.Var("identity"), replaced_at: q.Now() },
};

export const replace: DBFactoryFQLUDFReplace = {
  document(collectionExpr, idExpr, dataExpr) {
    return q.Let(
      {
        safeData: q.Merge(dataExpr, DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        doc: replacebaseFQL.document(collectionExpr, idExpr, q.Var("safeData")),
        operation: CallSystemOperator(updateBaseFQL.document(collectionExpr, q.Select(["ref", "id"], q.Var("doc")), replaceLogData)),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  database(nameExpr, optionsExpr) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", optionsExpr, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(optionsExpr, { data: q.Var("safeData") }),
        doc: replacebaseFQL.database(nameExpr, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.database(nameExpr, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  collection(nameExpr, optionsExpr) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", optionsExpr, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(optionsExpr, { data: q.Var("safeData") }),
        doc: replacebaseFQL.collection(nameExpr, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.collection(nameExpr, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  index(nameExpr, optionsExpr) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", optionsExpr, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(optionsExpr, { data: q.Var("safeData") }),
        doc: replacebaseFQL.index(nameExpr, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.index(nameExpr, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  udfunction(nameExpr, optionsExpr) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", optionsExpr, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(optionsExpr, { data: q.Var("safeData") }),
        doc: replacebaseFQL.udfunction(nameExpr, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.udfunction(nameExpr, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  role(nameExpr, optionsExpr) {
    return q.Let(
      {
        doc: replacebaseFQL.role(nameExpr, optionsExpr),
        // operation: CallSystemOperator(updateBaseFQL.role(nameExpr, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  token(id, optionsExpr) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", optionsExpr, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(optionsExpr, { data: q.Var("safeData") }),
        doc: replacebaseFQL.token(id, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.token(id, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  key(id, optionsExpr) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", optionsExpr, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(optionsExpr, { data: q.Var("safeData") }),
        doc: replacebaseFQL.key(id, q.Var("safeOptions")),
        operation: CallSystemOperator(updateBaseFQL.key(id, { data: replaceLogData })),
        action: CallLogAction("replace", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
};
