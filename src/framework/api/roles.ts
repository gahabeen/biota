import { FrameworkRolesApi } from '~/../types/framework/framework.roles';

import { activity } from '~/framework/api/roles/activity';
import { findAll } from '~/framework/api/roles/findAll';
import { deleteMany } from '~/framework/api/roles/deleteMany';
import { expireManyAt } from '~/framework/api/roles/expireManyAt';
import { expireManyIn } from '~/framework/api/roles/expireManyIn';
import { expireManyNow } from '~/framework/api/roles/expireManyNow';
import { forgetMany } from '~/framework/api/roles/forgetMany';
import { getMany } from '~/framework/api/roles/getMany';
import { insertMany } from '~/framework/api/roles/insertMany';
import { replaceMany } from '~/framework/api/roles/replaceMany';
import { repsertMany } from '~/framework/api/roles/repsertMany';
import { restoreMany } from '~/framework/api/roles/restoreMany';
import { updateMany } from '~/framework/api/roles/updateMany';
import { upsertMany } from '~/framework/api/roles/upsertMany';
import { dropMany } from '~/framework/api/roles/dropMany';

export const roles: FrameworkRolesApi = {
  activity,
  findAll,
  deleteMany,
  expireManyAt,
  expireManyIn,
  expireManyNow,
  forgetMany,
  getMany,
  insertMany,
  replaceMany,
  repsertMany,
  restoreMany,
  updateMany,
  upsertMany,
  dropMany,
};
