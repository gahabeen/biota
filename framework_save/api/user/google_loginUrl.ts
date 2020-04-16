import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { google } from '~/framework/api/user/auth/providers/google';
import { FrameworkAuthConnectUrlOptions } from '~/../types/framework/framework.user';

export async function googleLoginUrl(this: Biota, options: FrameworkAuthConnectUrlOptions): Promise<string> {
  const self = this;
  return execute(
    [
      {
        name: `Login url for Google`,
        async task() {
          // client_id && redirect_uri required
          const { state = {} } = options || {};
          return google.connectUrl({
            ...options,
            state: {
              ...state,
              scenario: 'login',
            },
          });
        },
      },
    ],
    {
      domain: 'Biota.user.google.loginUrl',
    },
  );
}
