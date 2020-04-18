import { FrameworkIndexesApi } from '~/types/framework/framework.indexes';

import { activity } from '~/framework/api/indexes/activity';
import { findAll } from '~/framework/api/indexes/findAll';
import { deleteMany } from '~/framework/api/indexes/deleteMany';
import { expireManyAt } from '~/framework/api/indexes/expireManyAt';
import { expireManyIn } from '~/framework/api/indexes/expireManyIn';
import { expireManyNow } from '~/framework/api/indexes/expireManyNow';
import { forgetMany } from '~/framework/api/indexes/forgetMany';
import { getMany } from '~/framework/api/indexes/getMany';
import { insertMany } from '~/framework/api/indexes/insertMany';
import { replaceMany } from '~/framework/api/indexes/replaceMany';
import { repsertMany } from '~/framework/api/indexes/repsertMany';
import { restoreMany } from '~/framework/api/indexes/restoreMany';
import { updateMany } from '~/framework/api/indexes/updateMany';
import { upsertMany } from '~/framework/api/indexes/upsertMany';
import { dropMany } from '~/framework/api/indexes/dropMany';
import { findIndex } from '~/framework/api/indexes/findIndex';
import { searchQuery } from '~/framework/api/indexes/searchQuery';
import { findByResource } from '~/framework/api/indexes/findByResource';
import { findByTerm } from '~/framework/api/indexes/findByTerm';

export const indexes: FrameworkIndexesApi = {
  findIndex,
  searchQuery,
  findByResource,
  findByTerm,
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
