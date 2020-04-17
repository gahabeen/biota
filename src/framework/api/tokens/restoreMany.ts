import { FrameworkTokensApi } from 'types/framework/framework.tokens';
import { tokens } from '~/factory/api/tokens';
import { execute } from '~/tools/tasks';

export const restoreMany: FrameworkTokensApi['restoreMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Restore many tokens`,
        task() {
          return self.query(tokens(self.context).restoreMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.tokens.restoreMany',
    },
  );
};
