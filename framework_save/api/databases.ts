import { BiotaFrameworkDatabasesApi } from '~/../types/framework/framework.databases';

import { dropAll } from '~/framework/api/databases/dropAll';

export const databases: BiotaFrameworkDatabasesApi = {
  dropAll,
};
