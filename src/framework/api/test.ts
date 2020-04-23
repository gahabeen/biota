import { Biota } from '~/biota';

export function as(this: Biota): Biota {
  this.test = true;
  return this;
}
