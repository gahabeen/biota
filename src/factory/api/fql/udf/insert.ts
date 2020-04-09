import { query as q } from "faunadb";
import { DBFactoryFQLUDFInsert } from "~/../types/factory/factory.fql.udf";
import { insert as insertBaseFQL } from "~/factory/api/fql/base/insert";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { CallLogAction, CallSystemOperator, CallIsPrivateKeyValid } from "~/framework/helpers/call_functions";
import { DOCUMENT_RESERVED_DATA_FIELDS_OBJ } from "~/consts";

let insertLogData = {
  _membership: { owner: q.Var("identity") },
  _activity: { created_by: q.Var("identity"), created_at: q.Now() },
};

export const insert: DBFactoryFQLUDFInsert = {
  document(collection, data, id) {
    return q.Let(
      {
        safeData: q.Merge(data, DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        doc: insertBaseFQL.document(collection, q.Var("safeData"), id),
        operation: CallSystemOperator(updateBaseFQL.document(collection, q.Select(["ref", "id"], q.Var("doc")), insertLogData)),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
  database(name, optionsExpr) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", optionsExpr, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(optionsExpr, { data: q.Var("safeData") }),
        doc: insertBaseFQL.database(name, q.Var("safeOptions")),
        // #improve - can't do UPDATE at same time of CREATE
        // operation: CallSystemOperator(updateBaseFQL.database(q.Select("name", q.Var("doc")) as string, { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  collection(name, optionsExpr) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", optionsExpr, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(optionsExpr, { data: q.Var("safeData") }),
        doc: insertBaseFQL.collection(name, q.Var("safeOptions")),
        // #improve - can't do UPDATE at same time of CREATE
        // operation: CallSystemOperator(updateBaseFQL.collection(q.Select("name", q.Var("doc")) as string, { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  index(name, optionsExpr) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", optionsExpr, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(optionsExpr, { data: q.Var("safeData") }),
        doc: insertBaseFQL.index(name, q.Var("safeOptions")),
        // #improve - can't do UPDATE at same time of CREATE
        // operation: CallSystemOperator(updateBaseFQL.index(q.Select("name", q.Var("doc")) as string, { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  udfunction(nameExpr, optionsExpr) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", optionsExpr, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(optionsExpr, { data: q.Var("safeData") }),
        doc: insertBaseFQL.udfunction(nameExpr, q.Var("safeOptions")),
        // #improve - can't do UPDATE at same time of CREATE
        // operation: CallSystemOperator(updateBaseFQL.udfunction(q.Select("name", q.Var("doc")) as string, { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  role(name, optionsExpr) {
    return q.Let(
      {
        doc: insertBaseFQL.role(name, optionsExpr),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  token(ref, optionsExpr) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", optionsExpr, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(optionsExpr, { data: q.Var("safeData") }),
        doc: insertBaseFQL.token(ref, q.Var("safeOptions")),
        // #improve - can't do UPDATE at same time of CREATE
        // operation: CallSystemOperator(updateBaseFQL.token(q.Select(["ref", "id"], q.Var("doc")), { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  key(name, optionsExpr) {
    return q.Let(
      {
        safeData: q.Merge(q.Select("data", optionsExpr, {}), DOCUMENT_RESERVED_DATA_FIELDS_OBJ),
        safeOptions: q.Merge(optionsExpr, { data: q.Var("safeData") }),
        doc: insertBaseFQL.key(name, q.Var("safeOptions")),
        // #improve - can't do UPDATE at same time of CREATE
        // operation: CallSystemOperator(updateBaseFQL.key(q.Select(["ref", "id"], q.Var("doc")), { data: insertLogData })),
        action: CallLogAction("insert", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
};
