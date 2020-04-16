import { FrameworkAuthAuthenticateOptions, FrameworkUserAuthProviderDataApi } from '~/../types/framework/framework.user';
import { Biota } from '~/biota';
import { google } from '~/framework/api/user/auth/providers/google';
import { execute } from '~/tools/tasks';
import { parseOpenIDUserInfo } from './auth/openid';

export async function googleAuthenticate(
  this: Biota,
  options: FrameworkAuthAuthenticateOptions,
  data?: FrameworkUserAuthProviderDataApi,
): Promise<any> {
  const self = this;
  return execute(
    [
      {
        name: `Authenticate through Google`,
        async task() {
          const { access_token } = await google.authenticate(options);
          const { state } = data || {};
          const { scenario, key, iv } = state || {};
          if (access_token) {
            const userInfo = await google.userInfo({ access_token }).then(parseOpenIDUserInfo)
            return self.user.registerWithAuthAccount({
              provider: 'google',
              id: userInfo.sub,
              userInfo,
            });
            // if (scenario === 'register') {

            // } else if (scenario === 'login') {
            // } else if (scenario === 'sync') {
            //   // if (user) {
            //   //   let secret = decrypt(user, iv, self.private_key);
            //   // }
            // }

            //   // const asUser = new Biota({ secret });
            //   let tokenInfo = await google.tokenInfo({ access_token });
          }
        },
      },
    ],
    {
      domain: 'Biota.user.google.googleAuthenticate',
    },
  );
}
