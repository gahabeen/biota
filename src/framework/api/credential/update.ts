import { FactoryCredential } from '~/types/factory/factory.credential';
import { FrameworkCredentialApi } from '~/types/framework/framework.credential';
import { credential } from '~/factory/api/credential';
import { execute } from '~/tools/tasks';

export const update: FactoryCredential<FrameworkCredentialApi['update']> = function (idOrInstance) {
  const self = this;

  return async function updateMethod(currentPassword = null, password = null) {
    return execute(
      [
        {
          name: `Update (${idOrInstance})`,
          task() {
            return self.query(credential(self.context)(idOrInstance).update(currentPassword, password));
          },
        },
      ],
      {
        domain: 'Biota.credential.update',
      },
    );
  };
};
