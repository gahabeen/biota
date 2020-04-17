import { FrameworkTokensApi } from 'types/framework/framework.tokens';
import { tokens } from '~/factory/api/tokens';
import { execute } from '~/tools/tasks';

export const forgetMany: FrameworkTokensApi['forgetMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Forget many tokens`,
        task() {
          return self.query(tokens(self.context).forgetMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.tokens.forgetMany',
    },
  );
};
