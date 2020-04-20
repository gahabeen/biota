import { FaunaRoleOptions } from '~/types/fauna';
import { CONVENTION } from '~/consts';

export function BiotaRoleName(name: string) {
  return `${CONVENTION.ROLE_PREFIX}${name.replace(CONVENTION.ROLE_PREFIX, '')}`;
}

export function Role(role: FaunaRoleOptions): FaunaRoleOptions {
  const { name, membership, privileges } = role || {};
  const self = {
    name,
    membership,
    privileges: privileges || [],
  };

  return self;
}
