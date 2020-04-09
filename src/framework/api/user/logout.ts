import { DB } from "~/db";
import { execute } from "~/tasks";
import { query as q } from "faunadb";
import { user as userCALL } from "~/factory/api/call/user";

export async function logout(this: DB, everywhere: boolean = false) {
  let self = this;
  return execute(
    [
      {
        name: `Logout`,
        task() {
          return self.query(userCALL.logout.call(self, everywhere));
        },
      },
    ],
    {
      domain: "DB.user.logout",
    }
  );
}
