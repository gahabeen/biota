import { DB } from "~/db";
import { execute } from "~/tasks";
import { google } from "~/framework/api/user/auth/providers/google";
import { DBFrameworkAuthConnectUrlOptions } from "~/../types/framework/framework.user";

export async function googleLoginUrl(this: DB, options: DBFrameworkAuthConnectUrlOptions): Promise<string> {
  let self = this;
  return execute(
    [
      {
        name: `Login url for Google`,
        async task() {
          // client_id && redirect_uri required
          return google.connectUrl({
            ...options,
            state: {
              ...(typeof options.state === "object" ? options.state : {}),
              action: "login",
            },
          });
        },
      },
    ],
    {
      domain: "DB.user.google.loginUrl",
    }
  );
}
