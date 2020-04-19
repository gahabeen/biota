import { execute } from '~/tools/tasks';
import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { google } from '~/framework/auth/providers/google';

export const authGoogleLoginUrl: FactoryUser<FrameworkUserApi['auth']['google']['loginUrl']> = function (id = null) {
  const self = this;

  return async (options) => {
    return execute(
      [
        {
          name: `Login with Google`,
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
        domain: 'Biota.user.auth.google.loginUrl',
      },
    );
  };
};
