import { FaunaDatabaseOptions } from '~/types/fauna';

export function Database(database: FaunaDatabaseOptions): FaunaDatabaseOptions {
  let { name, data = {}, api_version } = database || {};

  let self = {
    name,
    data,
    api_version,
  };

  return self;
}
