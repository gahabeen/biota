import { DB } from "~/db";
import { user as userCALL } from "~/factory/api/call/user";
import { execute } from "~/tasks";

export async function login(this: DB, email: string, password: string) {
  let self = this;
  return execute(
    [
      {
        name: `Login for [${email}]`,
        task() {
          return self.query(userCALL.login.call(self, email, password)).then(({ secret }) => {
            if (secret) {
              let newSelf = new DB({ secret, private_key: self.private_key });
              newSelf.secret = secret;
              return newSelf;
            } else return self;
          });
        },
      },
    ],
    {
      domain: "DB.user.login",
    }
  );
}
