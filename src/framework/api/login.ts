// types
// external
import { DB } from "~/db";
import * as collectionFactory from "~/factory/api/collection";
import { execute } from "~/tasks";

export async function login(this: DB, id: string, password: string): Promise<DB> {
  return execute(
    [
      {
        name: `Loggin in as (${id})`,
        task() {
          return this.query(collectionFactory.collection("users").login(id, password)).then(({ secret }) => new DB({ secret }));
        }
      }
    ],
    {
      domain: "DB.login"
    }
  );
}
