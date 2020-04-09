import { DBFrameworkIndexesApi } from "~/../types/framework/framework.indexes";

import { cleanAll } from "~/framework/api/indexes/cleanAll";

export const indexes: DBFrameworkIndexesApi = {
  cleanAll,
};
