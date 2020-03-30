// types
import { FaunaRef, DBFrameworkDocument } from "~/../types/db";
import { DB } from "~/db";
// eternal
import { query as q } from "faunadb";
// biota
import { get } from "~/factory/api/get";

export function document(docRef: FaunaRef): DBFrameworkDocument {
  let self: DB = this;
  let methods: DBFrameworkDocument = {
    async get() {
      return self.query(q.Get(docRef));
    },
    async view() {}
  };

  return methods;
}
