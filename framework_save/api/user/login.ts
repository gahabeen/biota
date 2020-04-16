import { Biota } from '~/biota';
import { user as userCALL } from '~/factory/api/call/user';
import { execute } from '~/tools/tasks';

export async function login(this: Biota, email: string, password: string) {
  const self = this;
  return execute(
    [
      {
        name: `Login for [${email}]`,
        task() {
          return self.query(userCALL.login.call(self, email, password)).then(({ secret }) => {
            if (secret) {
              let newSelf = new Biota({ secret, private_key: self.private_key });
              newSelf.secret = secret;
              return newSelf;
            } else return self;
          });
        },
      },
    ],
    {
      domain: 'Biota.user.login',
    },
  );
}
