import { FrameworkSessionsApi } from '~/types/framework/framework.sessions';
import { sessions } from '~/factory/api/sessions';
import { execute } from '~/tools/tasks';

export const insertMany: FrameworkSessionsApi['insertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Insert many sessions`,
        task() {
          return self.query(sessions(self.context).insertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.sessions.insertMany',
    },
  );
};
