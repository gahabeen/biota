import { Biota } from '~/biota';
import { user as userCALL } from '~/factory/api/call/user';
import { execute } from '~/tasks';

export async function register(this: Biota, email: string, password: string, data: object = {}) {
  const self = this;
  return execute(
    [
      {
        name: `Register for [${email}]`,
        task() {
          return self.query(userCALL.register.call(self, email, password, data)).then((res) => {
            let { secret } = res;
            if (secret) return new Biota({ secret });
            else return self;
          });
        },
      },
    ],
    {
      domain: 'Biota.user.register',
    },
  );
}
