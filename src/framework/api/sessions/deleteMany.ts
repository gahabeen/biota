import { FrameworkSessionsApi } from 'types/framework/framework.sessions';
import { sessions } from '~/factory/api/sessions';
import { execute } from '~/tools/tasks';

export const deleteMany: FrameworkSessionsApi['deleteMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Delete many sessions`,
        task() {
          return self.query(sessions(self.context).deleteMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.sessions.deleteMany',
    },
  );
};
