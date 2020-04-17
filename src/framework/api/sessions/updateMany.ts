import { FrameworkSessionsApi } from 'types/framework/framework.sessions';
import { sessions } from '~/factory/api/sessions';
import { execute } from '~/tools/tasks';

export const updateMany: FrameworkSessionsApi['updateMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Update many sessions`,
        task() {
          return self.query(sessions(self.context).updateMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.sessions.updateMany',
    },
  );
};
