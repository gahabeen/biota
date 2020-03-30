import { DBFrameworkCollectionValueOptions } from "~/../types/db";

export const viewDefinition = (value: DBFrameworkCollectionValueOptions) => {
  let options: DBFrameworkCollectionValueOptions = {
    field: null,
    values: [],
    binding: null,
    unique: false,
    serialized: true,
    data: {}
  };

  Object.assign(options, value);
  return options;
};
