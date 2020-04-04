import { query as q } from "faunadb";
import { DBFactoryFQLUDFAssign } from "~/../types/factory/factory.fql.udf";
import { get as getBaseFQL } from "~/factory/api/fql/base/get";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { CallLogAction, CallSystemOperator } from "~/framework/helpers/WrapActionAndLog";

let assignLogData = (newAssignee: any) => ({
  activity: { assigned_by: newAssignee, assigned_at: q.Now() },
});

export const assign: DBFactoryFQLUDFAssign = {
  document(collection, id, newAssignee) {
    return q.Let(
      {
        operation: CallSystemOperator(
          updateBaseFQL.document(collection, q.Select(["ref", "id"], q.Var("doc")), { data: assignLogData(newAssignee) })
        ),
        doc: getBaseFQL.document(collection, id),
        action: CallLogAction("assign", q.Var("doc")),
      },
      q.Var("doc")
    );
  },
};
