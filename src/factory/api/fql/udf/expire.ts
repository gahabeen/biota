import { query as q } from "faunadb";
import { DBFactoryFQLUDFExpire } from "~/../types/factory/factory.fql.udf";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { get as getBaseFQL } from "~/factory/api/fql/base/get";
import { CallLogAction, CallSystemOperator } from "~/framework/helpers/WrapActionAndLog";

let expireLogData = (at: any) => ({
  activity: { expired_by: q.Var("identity"), expired_at: at },
});

export const expire: DBFactoryFQLUDFExpire = {
  document(collection, id, at) {
    return q.Let(
      {
        operation: CallSystemOperator(updateBaseFQL.document(collection, id, { data: expireLogData(at) })),
        doc: getBaseFQL.document(collection, id),
        action: CallLogAction("expire", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
};
