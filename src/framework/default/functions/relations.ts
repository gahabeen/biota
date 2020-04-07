import { query as q } from "faunadb";
import { collectionNameNormalized } from "~/factory/classes/collection";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";

export const Relations = UDFunction({
  name: udfunctionNameNormalized("Relations"),
  body: q.Query(
    q.Lambda(
      ["identity", "ref"],
      q.If(
        q.And(q.IsRef(q.Var("ref")), q.Exists(q.Var("ref"))),
        q.Let(
          {
            relations: q.Map(
              q.Paginate(
                q.Call(udfunctionNameNormalized("SearchQuery"), [
                  q.Collection(collectionNameNormalized("relations")),
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
