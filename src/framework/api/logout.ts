import { query as q } from "faunadb";
import { execute } from "~/tasks";

export async function login(everywhere: boolean) {
  return execute(
    [
      {
        name: `Logging out (everywhere: ${everywhere})`,
        task() {
          return this.query(q.Logout(everywhere));
        }
      }
    ],
    {
      domain: "DB.logout"
    }
  );
}
