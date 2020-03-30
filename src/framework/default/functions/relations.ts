// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, BiotaUDFunctionName } from "~/factory/api/udfunction";
import { BiotaCollectionName } from "~/factory/api/collection";
import { logData } from "~/framework/helpers/logData";

export const Relations = UDFunction({
  name: "Relations",
  body: q.Query(
    q.Lambda(
      ["userRef", "ref"],
      q.If(
        q.And(q.IsRef(q.Var("ref")), q.Exists(q.Var("ref"))),
        q.Let(
          {
            relations: q.Map(
              q.Paginate(
                q.Call(BiotaUDFunctionName("SearchQuery"), [
                  q.Collection(BiotaCollectionName("relations")),
                  {
                    "parts.collection": q.Select(
                      "collection",
                      q.Var("ref"),
                      null
                    )
                  }
                ]),
                { size: 1000 }
              ),
              x => q.Get(x)
            )
          },
          q.If(q.Not(q.IsEmpty(q.Var("relations"))), q.Var("relations"), [])
        ),
        q.Abort("Ref doesn't exists")
      )
    )
  )
});
