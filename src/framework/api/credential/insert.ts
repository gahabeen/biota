import { FactoryCredential } from '~/types/factory/factory.credential';
import { FrameworkCredentialApi } from '~/types/framework/framework.credential';
import { FaunaId } from '~/types/fauna';
import { credential } from '~/factory/api/credential';
import { execute } from '~/tools/tasks';

export const insert: FactoryCredential<FrameworkCredentialApi['insert']> = function (idOrRefOrInstance) {
  const self = this;

  return async (password) => {
    return execute(
      [
        {
          name: `Insert data in [${idOrRefOrInstance}]`,
          task() {
            return self.query(credential(self.context)(idOrRefOrInstance).insert(password));
          },
        },
      ],
      {
        domain: 'Biota.credential.insert',
      },
    );
  };
};
