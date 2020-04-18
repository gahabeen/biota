import { FactoryCredential } from '~/types/factory/factory.credential';
import { FrameworkCredentialApi } from '~/types/framework/framework.credential';
import { credential } from '~/factory/api/credential';
import { execute } from '~/tools/tasks';

export const forget: FactoryCredential<FrameworkCredentialApi['forget']> = function (idOrRefOrInstance) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Forget (${idOrRefOrInstance})`,
          task() {
            return self.query(credential(self.context)(idOrRefOrInstance).forget());
          },
        },
      ],
      {
        domain: 'Biota.credential.forget',
      },
    );
  };
};
