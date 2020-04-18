import { FrameworkSessionsApi } from '~/types/framework/framework.sessions';
import { sessions } from '~/factory/api/sessions';
import { execute } from '~/tools/tasks';

export const expireManyIn: FrameworkSessionsApi['expireManyIn'] = async function (nameList, delay) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many sessions in ${delay}ms`,
        task() {
          return self.query(sessions(self.context).expireManyIn(nameList, delay));
        },
      },
    ],
    {
      domain: 'Biota.sessions.expireManyIn',
    },
  );
};
