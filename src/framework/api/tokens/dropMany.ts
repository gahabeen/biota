import { FrameworkTokensApi } from 'types/framework/framework.tokens';
import { tokens } from '~/factory/api/tokens';
import { execute } from '~/tools/tasks';

export const dropMany: FrameworkTokensApi['dropMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Drop many tokens`,
        task() {
          return self.query(tokens(self.context).dropMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.tokens.dropMany',
    },
  );
};
