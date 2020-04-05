import { query as q } from "faunadb";
import { DBFactoryFQLUDFUnAssign } from "~/../types/factory/factory.fql.udf";
import { get as getBaseFQL } from "~/factory/api/fql/base/get";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { CallLogAction, CallSystemOperator } from "~/framework/helpers/WrapActionAndLog";

let assignLogData = (oldAssignee: any) => ({
  activity: { assigned_by: oldAssignee, assigned_at: q.Now() },
});

export const unassign: DBFactoryFQLUDFUnAssign = {
  document(collection, id, oldAssignee) {
    return q.Let(
      {
        operation: CallSystemOperator(updateBaseFQL.document(collection, id, { data: assignLogData(oldAssignee) })),
        doc: getBaseFQL.document(collection, id),
        action: CallLogAction("assign", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
};
