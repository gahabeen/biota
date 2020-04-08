import { DB } from "~/db";
import { execute } from "~/tasks";
import { query as q } from "faunadb";

export async function logout(this: DB, everywhere: boolean = false) {
  let self = this;
  return execute(
    [
      {
        name: `Logout`,
        task() {
          return self.query(q.Logout(everywhere));
        },
      },
    ],
    {
      domain: "DB.user.logout",
    }
  );
}
