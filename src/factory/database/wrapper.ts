// types
import { FaunaDatabaseOptions } from "~/../types/db";

export function Database(database: FaunaDatabaseOptions): FaunaDatabaseOptions {
  let { name, data = {}, api_version } = database || {};

  let self = {
    name,
    data,
    api_version
  };

  return self;
}
