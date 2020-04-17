import { FrameworkTokensApi } from 'types/framework/framework.tokens';
import { tokens } from '~/factory/api/tokens';
import { execute } from '~/tools/tasks';

export const getMany: FrameworkTokensApi['getMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Get many tokens`,
        task() {
          return self.query(tokens(self.context).getMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.tokens.getMany',
    },
  );
};
