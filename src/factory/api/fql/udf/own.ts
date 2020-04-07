import { query as q } from "faunadb";
import { DBFactoryFQLUDFOwn } from "~/../types/factory/factory.fql.udf";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { get as getBaseFQL } from "~/factory/api/fql/base/get";
import { CallLogAction, CallSystemOperator } from "~/framework/helpers/WrapActionAndLog";

let ownLogData = (newOwner: any) => ({
  _membership: {
    owner: newOwner,
  },
  _activity: { owner_changed_by: q.Var("identity"), owner_changed_at: q.Now() },
});

export const own: DBFactoryFQLUDFOwn = {
  document(collection, id, newOwner) {
    return q.Let(
      {
        operation: CallSystemOperator(updateBaseFQL.document(collection, id, ownLogData(newOwner))),
        doc: getBaseFQL.document(collection, id),
        action: CallLogAction("own", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
};
