import { DBFactoryIndex } from "~/../types/factory.index";

import { get } from "~/factory/api/fql/base/get";
import { insert } from "~/factory/api/fql/base/insert";
import { update } from "~/factory/api/fql/base/update";
import { upsert } from "~/factory/api/fql/base/upsert";
import { replace } from "~/factory/api/fql/base/replace";
import { repsert } from "~/factory/api/fql/base/repsert";
import { deleteMethods } from "~/factory/api/fql/base/delete";
import { forget } from "~/factory/api/fql/base/forget";

export function index(name: string = undefined): DBFactoryIndex {
  if (!name) {
    throw new Error(`biota.index(name) - valid name is required`);
  }

  return {
    get: get.index,
    insert: insert.index,
    update: update.index,
    upsert: upsert.index,
    replace: replace.index,
    repsert: repsert.index,
    delete: deleteMethods.index,
    forget: forget.index,
  };
}
