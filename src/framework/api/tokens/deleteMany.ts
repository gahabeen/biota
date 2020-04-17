import { FrameworkTokensApi } from 'types/framework/framework.tokens';
import { tokens } from '~/factory/api/tokens';
import { execute } from '~/tools/tasks';

export const deleteMany: FrameworkTokensApi['deleteMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Delete many tokens`,
        task() {
          return self.query(tokens(self.context).deleteMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.tokens.deleteMany',
    },
  );
};
