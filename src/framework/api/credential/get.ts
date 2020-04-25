import { FactoryCredential } from '~/types/factory/factory.credential';
import { FrameworkCredentialApi } from '~/types/framework/framework.credential';
import { credential } from '~/factory/api/credential';
import { execute } from '~/tools/tasks';

export const get: FactoryCredential<FrameworkCredentialApi['get']> = function (idOrInstance) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${idOrInstance})`,
          task() {
            return self.query(credential(self.context)(idOrInstance).get());
          },
        },
      ],
      {
        domain: 'Biota.credential.get',
      },
    );
  };
};
