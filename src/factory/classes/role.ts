import { FaunaRoleOptions } from "~/../types/db";
import { CONVENTION } from "~/consts";

export * from "../role/action"
export * from "../role/privilege"

export function roleNameNormalized(name: string) {
  return `${CONVENTION.ROLE_PREFIX}${name.replace(CONVENTION.ROLE_PREFIX, "")}`;
}

export function Role(role: FaunaRoleOptions): FaunaRoleOptions {
  let { name, membership, privileges } = role || {};
  let self = {
    name,
    membership,
    privileges: privileges || []
  };

  return self;
}
