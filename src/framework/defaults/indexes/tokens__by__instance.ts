import * as fauna from "faunadb";
const q = fauna.query;
import { Index, indexNameNormalized } from "~/factory/classes/index";

export const tokens__by__instance = Index({
  name: indexNameNormalized("tokens__by__instance"),
  source: {
    collection: q.Tokens(),
  },
  terms: [
    {
      field: ["instance"],
    },
  ],
  values: [
    {
      field: ["ref"],
    },
  ],
});
