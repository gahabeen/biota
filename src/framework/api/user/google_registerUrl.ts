import { DB } from '~/db';
import { execute } from '~/tasks';
import { google } from '~/framework/api/user/auth/providers/google';
import { DBFrameworkAuthConnectUrlOptions } from '~/../types/framework/framework.user';

export async function googleRegisterUrl(this: DB, options: DBFrameworkAuthConnectUrlOptions): Promise<string> {
  const self = this;
  return execute(
    [
      {
        name: `Register url for Google`,
        async task() {
          // client_id && redirect_uri required
          const { state = {} } = options || {};
          return google.connectUrl({
            ...options,
            state: {
              ...state,
              scenario: 'register',
            },
          });
        },
      },
    ],
    {
      domain: 'DB.user.google.registerUrl',
    },
  );
}
