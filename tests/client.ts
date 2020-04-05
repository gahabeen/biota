import { Biota, factory } from "./../src/index";

export function client() {
  return new Biota({ secret: process.env.FAUNA_DB_SECRET });
}

export { factory };
