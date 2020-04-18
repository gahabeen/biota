import { FrameworkSessionsApi } from '~/types/framework/framework.sessions';
import { sessions } from '~/factory/api/sessions';
import { execute } from '~/tools/tasks';

export const getMany: FrameworkSessionsApi['getMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Get many sessions`,
        task() {
          return self.query(sessions(self.context).getMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.sessions.getMany',
    },
  );
};
