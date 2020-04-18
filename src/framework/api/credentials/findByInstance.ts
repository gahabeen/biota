import { FrameworkCredentialsApi } from '~/types/framework/framework.credentials';
import { credentials } from '~/factory/api/credentials';
import { execute } from '~/tools/tasks';

export const findByInstance: FrameworkCredentialsApi['findByInstance'] = async function (instance = null, pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find all credentials`,
        task() {
          return self.query(credentials(self.context).findByInstance(instance, pagination));
        },
      },
    ],
    {
      domain: 'Biota.credentials.findByInstance',
    },
  );
};
