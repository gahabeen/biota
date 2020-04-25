import { credential } from '~/factory/api/credential';
import { execute } from '~/tools/tasks';
import { FactoryCredential } from '~/types/factory/factory.credential';
import { FrameworkCredentialApi } from '~/types/framework/framework.credential';

export const insert: FactoryCredential<FrameworkCredentialApi['insert']> = function (idOrInstance) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return async (password) => {
    return execute(
      [
        {
          name: `Insert data in [${idOrInstance}]`,
          task() {
            return self.query(credential(self.context)(idOrInstance).insert(password));
          },
        },
      ],
      {
        domain: 'Biota.credential.insert',
      },
    );
  };
};
