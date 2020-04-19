import { execute } from '~/tools/tasks';
import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { google } from '~/framework/auth/providers/google';
import { parseOpenIDUserInfo } from '~/framework/auth/constructors/openid';

export const authGoogleAuthenticate: FactoryUser<FrameworkUserApi['auth']['google']['authenticate']> = function (id = null) {
  const self = this;

  return async (options, data) => {
    return execute(
      [
        {
          name: `Authenticate with Google`,
          async task() {
            const { access_token } = await google.authenticate(options);
            // const { state } = data || {};
            // const { scenario, key, iv } = state || {};
            if (access_token) {
              const userInfo = await google.userInfo({ access_token }).then(parseOpenIDUserInfo);
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
        domain: 'Biota.user.auth.google.authenticate',
      },
    );
  };
};
