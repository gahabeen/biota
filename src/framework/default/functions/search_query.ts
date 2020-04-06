// types
// external
import { query as q } from "faunadb";
// biota
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { pathString } from "~/framework/helpers/path";

export const SearchQuery = UDFunction({
  name: udfunctionNameNormalized("SearchQuery"),
  body: q.Query(
    q.Lambda(
      ["resource", "search_terms"],
      q.Let(
        {
          searchTerms: q.ToArray(q.Var("search_terms")),
          termIndexes: q.Map(
            q.Var("searchTerms"),
            q.Lambda(
              ["field", "value"],
              q.If(
                q.IsObject(q.Var("value")),
                q.If(
                  q.Contains("$computed", q.Var("value")),
                  [
                    q.Call(udfunctionNameNormalized("FindIndex"), [q.Var("resource"), [q.Concat(["binding:", q.Var("field")])]]),
                    q.Select("$computed", q.Var("value"), null),
                    q.Concat(["binding:", pathString(q.Var("field"))]),
                  ],
                  q.If(
                    q.Contains("$ngram", q.Var("value")),
                    [
                      q.Call(udfunctionNameNormalized("FindIndex"), [
                        q.Var("resource"),
                        [q.Concat(["binding:", "ngram:", q.Var("field")])],
                      ]),
                      q.LowerCase(q.ToString(q.Select("$ngram", q.Var("value"), ""))),
                      q.Concat(["ngram:", pathString(q.Var("field"))]),
                    ],
                    [null, null, null]
                  )
                ),
                [
                  q.Call(udfunctionNameNormalized("FindIndex"), [q.Var("resource"), [q.Concat(["term:", pathString(q.Var("field"))])]]),
                  q.Var("value"),
                  q.Var("field"),
                ]
              )
            )
          ),
          validTermIndexes: q.Filter(q.Var("termIndexes"), q.Lambda(["index", "value", "field"], q.IsIndex(q.Var("index")))),
          unvalidIndexes: q.Filter(q.Var("termIndexes"), q.Lambda(["index", "value", "field"], q.Not(q.IsIndex(q.Var("index"))))),
          unvalidFields: q.Concat(q.Map(q.Var("unvalidIndexes"), q.Lambda(["index", "value", "field"], q.Var("field"))), ", "),
        },
        q.If(
          q.LT(q.Count(q.Var("unvalidIndexes")), 1),
          q.Intersection(q.Map(q.Var("validTermIndexes"), q.Lambda(["index", "value", "field"], q.Match(q.Var("index"), q.Var("value"))))),
          q.Abort(q.Concat(["Indexes couldn't be found for field(s): ", q.Concat(q.Var("unvalidFields"), ", ")], " "))
        )
      )
    )
  ),
});
