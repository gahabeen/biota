import { FrameworkSessionsApi } from 'types/framework/framework.sessions';
import { sessions } from '~/factory/api/sessions';
import { execute } from '~/tools/tasks';

export const dropMany: FrameworkSessionsApi['dropMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Drop many sessions`,
        task() {
          return self.query(sessions(self.context).dropMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.sessions.dropMany',
    },
  );
};
