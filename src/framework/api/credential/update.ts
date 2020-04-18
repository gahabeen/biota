import { FactoryCredential } from '~/types/factory/factory.credential';
import { FrameworkCredentialApi } from '~/types/framework/framework.credential';
import { credential } from '~/factory/api/credential';
import { execute } from '~/tools/tasks';

export const update: FactoryCredential<FrameworkCredentialApi['update']> = function (idOrRefOrInstance) {
  const self = this;

  return async function updateMethod(currentPassword = null, password = null) {
    return execute(
      [
        {
          name: `Update (${idOrRefOrInstance})`,
          task() {
            return self.query(credential(self.context)(idOrRefOrInstance).update(currentPassword, password));
          },
        },
      ],
      {
        domain: 'Biota.credential.update',
      },
    );
  };
};
