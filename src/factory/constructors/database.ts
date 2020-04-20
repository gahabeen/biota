import { FaunaDatabaseOptions } from '~/types/fauna';

export function Database(database: FaunaDatabaseOptions): FaunaDatabaseOptions {
  const { name, data = {}, api_version } = database || {};

  return {
    name,
    data,
    api_version,
  };
}
