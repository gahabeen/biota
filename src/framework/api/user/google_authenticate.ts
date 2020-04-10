import { DBFrameworkAuthAuthenticateOptions, DBFrameworkAuthAuthenticateResponse } from "~/../types/framework/framework.user";
import { DB } from "~/db";
import { google } from "~/framework/api/user/auth/providers/google";
import { execute } from "~/tasks";
import { decrypt } from "~/framework/helpers/crypto";

export async function googleAuthenticate(this: DB, options: DBFrameworkAuthAuthenticateOptions): Promise<any> {
  let self = this;
  return execute(
    [
      {
        name: `Authenticate through Google`,
        async task() {
          let { access_token, state } = await google.authenticate(options);
          let { scenario, user, iv } = state as any;
          // #improve
          if (access_token) {
            if (scenario === "register") {
            } else {
              if (user) {
                let secret = decrypt(user, iv, self.private_key);
              }
            }

            // const asUser = new DB({ secret });
            let userInfo = await google.userInfo({ access_token });
            let tokenInfo = await google.tokenInfo({ access_token });
          }
        },
      },
    ],
    {
      domain: "DB.user.google.loginUrl",
    }
  );
}
