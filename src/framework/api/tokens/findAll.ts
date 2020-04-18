import { FrameworkTokensApi } from '~/types/framework/framework.tokens';
import { tokens } from '~/factory/api/tokens';
import { execute } from '~/tools/tasks';

export const findAll: FrameworkTokensApi['findAll'] = async function (pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find all tokens`,
        task() {
          return self.query(tokens(self.context).findAll(pagination));
        },
      },
    ],
    {
      domain: 'Biota.tokens.findAll',
    },
  );
};
