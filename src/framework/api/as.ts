import { FaunaRef } from '~/types/fauna';
import { Biota } from '~/biota';

export function as(this: Biota, identity: FaunaRef): Biota {
  this.alternativeIdentity = identity;
  return this;
}
