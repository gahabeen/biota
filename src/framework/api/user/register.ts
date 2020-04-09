import { DB } from "~/db";
import { user as userCALL } from "~/factory/api/call/user";
import { execute } from "~/tasks";

export async function register(this: DB, email: string, password: string, data: object = {}) {
  let self = this;
  return execute(
    [
      {
        name: `Register for [${email}]`,
        task() {
          return self.query(userCALL.register.call(self, email, password, data)).then((res) => {
            let { secret } = res;
            if (secret) return new DB({ secret });
            else return self;
          });
        },
      },
    ],
    {
      domain: "DB.user.register",
    }
  );
}
