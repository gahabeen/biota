import { FactoryCredential } from '~/types/factory/factory.credential';
import { FrameworkCredentialApi } from '~/types/framework/framework.credential';
import { credential } from '~/factory/api/credential';
import { execute } from '~/tools/tasks';

export const get: FactoryCredential<FrameworkCredentialApi['get']> = function (idOrRefOrInstance) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${idOrRefOrInstance})`,
          task() {
            return self.query(credential(self.context)(idOrRefOrInstance).get());
          },
        },
      ],
      {
        domain: 'Biota.credential.get',
      },
    );
  };
};
