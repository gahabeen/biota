import { query as q } from "faunadb";
import { DBFactoryFQLUDFAssign } from "~/../types/factory/factory.fql.udf";
import { get as getBaseFQL } from "~/factory/api/fql/base/get";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import * as call from "~/factory/api/call";
import { CallLogAction, CallSystemOperator } from "~/framework/helpers/call_functions";

let assignLogData = (assignees: any) => ({
  _membership: {
    assignees: assignees,
  },
  _activity: { assigned_by: q.Var("identity"), assigned_at: q.Now() },
});

export const assign: DBFactoryFQLUDFAssign = {
  document(collection, id, newAssignee) {
    return q.Let(
      {
        doc: getBaseFQL.document(collection, id),
        current_assignees: q.Select(["data", "_membership", "assignees"], q.Var("doc"), []),
        assignees: q.Distinct(q.Union(q.Var("current_assignees"), [newAssignee])),
        operation: CallSystemOperator(updateBaseFQL.document(collection, id, assignLogData(q.Var("assignees")))),
        action: CallLogAction("assign", q.Var("doc")),
      },
      q.Var("operation")
    );
  },
};
