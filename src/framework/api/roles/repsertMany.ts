import { FrameworkRolesApi } from '~/types/framework/framework.roles';
import { roles } from '~/factory/api/roles';
import { execute } from '~/tools/tasks';

export const repsertMany: FrameworkRolesApi['repsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many roles`,
        task() {
          return self.query(roles(self.context).repsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.roles.repsertMany',
    },
  );
};
