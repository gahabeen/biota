import { FrameworkSessionsApi } from 'types/framework/framework.sessions';
import { sessions } from '~/factory/api/sessions';
import { execute } from '~/tools/tasks';

export const restoreMany: FrameworkSessionsApi['restoreMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Restore many sessions`,
        task() {
          return self.query(sessions(self.context).restoreMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.sessions.restoreMany',
    },
  );
};
