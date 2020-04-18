import { FrameworkCredentialsApi } from '~/types/framework/framework.credentials';
import { credentials } from '~/factory/api/credentials';
import { execute } from '~/tools/tasks';

export const findAll: FrameworkCredentialsApi['findAll'] = async function (pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find all credentials`,
        task() {
          return self.query(credentials(self.context).findAll(pagination));
        },
      },
    ],
    {
      domain: 'Biota.credentials.findAll',
    },
  );
};
