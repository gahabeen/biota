import { FactoryCredential } from '~/types/factory/factory.credential';
import { FrameworkCredentialApi } from '~/types/framework/framework.credential';
import { credential } from '~/factory/api/credential';
import { execute } from '~/tools/tasks';

export const drop: FactoryCredential<FrameworkCredentialApi['drop']> = function (idOrRefOrInstance) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop (${idOrRefOrInstance})`,
          task() {
            return self.query(credential(self.context)(idOrRefOrInstance).drop());
          },
        },
      ],
      {
        domain: 'Biota.credential.drop',
      },
    );
  };
};
