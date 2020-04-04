import { DB } from "~/db";
import * as documentFactory from "~/factory/api/classes/document";
import { execute } from "~/tasks";
import { collectionNameNormalized } from "~/factory/classes/collection";

export async function login(this: DB, id: string, password: string): Promise<DB> {
  return execute(
    [
      {
        name: `Loggin in as (${id})`,
        task() {
          return this.query(documentFactory.document.login(collectionNameNormalized("users"), id, password)).then(
            ({ secret }) => new DB({ secret })
          );
        },
      },
    ],
    {
      domain: "DB.login",
    }
  );
}
