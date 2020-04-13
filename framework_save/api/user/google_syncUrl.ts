import { Biota } from '~/biota';
import { execute } from '~/tasks';
import { google } from '~/framework/api/user/auth/providers/google';
import { BiotaFrameworkAuthConnectUrlOptions } from '~/../types/framework/framework.user';
import { query as q } from 'faunadb';
import { encrypt } from '~/framework/helpers/crypto';

export async function googleSyncUrl(this: Biota, options: BiotaFrameworkAuthConnectUrlOptions): Promise<string> {
  const self = this;
  return execute(
    [
      {
        name: `Sync url for Google`,
        async task() {
          // client_id && redirect_uri required
          const { state = {} } = options || {};
          return self.query(q.HasIdentity()).then((hasIdentity) => {
            if (hasIdentity && self.secret) {
              const { iv, encrypted } = encrypt(self.secret, self.private_key || '');
              return google.connectUrl({
                ...options,
                state: {
                  ...state,
                  scenario: 'register',
                  user: encrypted,
                  iv: iv,
                },
              });
            } else {
              return {
                url: undefined,
              };
            }
          });
        },
      },
    ],
    {
      domain: 'Biota.user.google.syncUrl',
    },
  );
}
