import { DBFrameworkDatabasesApi } from "~/../types/framework/framework.databases";

import { cleanAll } from "~/framework/api/databases/cleanAll";

export const databases: DBFrameworkDatabasesApi = {
  cleanAll,
};
