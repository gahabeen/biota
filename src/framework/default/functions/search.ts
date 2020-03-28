// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction } from "~/factory/api/udfunction";
import { BiotaIndexName } from "~/factory/api/index";
import { pathString } from "~/framework/helpers/path";

/**
 * Call("Search", [
 *  {
 *    "data.profile.name": "val1",
 *    "data.profile.email": "val2"
 *  }
 * ])
 */

export const Search = UDFunction({
  name: "Search",
  body: q.Query(
    q.Lambda(
      ["resource", "search_terms", "pagination"],
      q.Let(
        {
          searchTerms: q.ToArray(q.Var("search_terms")),
          termIndexes: q.Map(
            q.Var("searchTerms"),
            q.Lambda(
              ["field", "value"],
              [
                q.Call(BiotaIndexName("FindIndex"), [
                  q.Var("resource"),
                  [q.Concat(["term:", pathString(q.Var("field"))])]
                ]),
                q.Var("value"),
                q.Var("field")
              ]
            )
          )
        },
        q.Paginate(
          q.Intersection(
            q.Map(
              q.Var("termIndexes"),
              q.Lambda(
                ["index", "value", "field"],
                q.If(
                  q.IsIndex(q.Var("index")),
                  q.Match(q.Var("index"), q.Var("value")),
                  q.Abort(
                    q.Concat([
                      "Couldn't find a matching index for the field",
                      q.Var("field")
                    ])
                  )
                )
              )
            )
          ),
          q.Var("pagination")
        )
      )
    )
  )
});
