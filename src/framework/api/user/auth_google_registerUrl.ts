import { execute } from '~/tools/tasks';
import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { google } from '~/framework/auth/providers/google';

export const authGoogleRegisterUrl: FactoryUser<FrameworkUserApi['auth']['google']['registerUrl']> = function (id = null) {
  const self = this;

  return async (options) => {
    return execute(
      [
        {
          name: `Register with Google`,
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
        domain: 'Biota.user.auth.google.registerUrl',
      },
    );
  };
};
