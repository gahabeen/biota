import { DB } from "~/db";
import { FaunaCollectionOptions, FaunaId } from "~/../types/fauna";
import { role } from "~/factory/api/classes/role";
import { execute } from "~/tasks";

export function forget(this: DB, roleName: string) {
  let self = this;

  return async function forgetMethod(id: FaunaId) {
    return execute(
      [
        {
          name: `Forget (${id}) in (${roleName})`,
          task() {
            return self.query(role.forget.call(self, roleName));
          },
        },
      ],
      {
        domain: "DB.role.forget",
      }
    );
  };
}
