import { query as q } from "faunadb";
import { DBFactoryFQLUDFExpire } from "~/../types/factory/factory.fql.udf";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { get as getBaseFQL } from "~/factory/api/fql/base/get";
import { CallLogAction, CallSystemOperator } from "~/framework/helpers/WrapActionAndLog";

let expireLogData = (at: any) => ({
  _activity: { expired_by: q.Var("identity"), expired_at: at },
});

export const expire: DBFactoryFQLUDFExpire = {
  documentAt(collection, id, at) {
    return q.Let(
      {
        operation: CallSystemOperator(updateBaseFQL.document(collection, id, expireLogData(at))),
        doc: getBaseFQL.document(collection, id),
        action: CallLogAction("expire", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  documentIn(collection, id, delayInMs) {
    return q.Let(
      {
        operation: CallSystemOperator(
          updateBaseFQL.document(collection, id, expireLogData(q.TimeAdd(q.Now(), q.ToNumber(delayInMs), "milliseconds")))
        ),
        doc: getBaseFQL.document(collection, id),
        action: CallLogAction("expire", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
  documentNow(collection, id) {
    return q.Let(
      {
        operation: CallSystemOperator(updateBaseFQL.document(collection, id, expireLogData(q.Now()))),
        doc: getBaseFQL.document(collection, id),
        action: CallLogAction("expire", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
};
