import moduleAlias from "module-alias";
moduleAlias.addAlias("~", __dirname);

export { DB as Biota } from "./db";
export { query as q } from "faunadb";
export { Page } from "./page";
export * as factory from "~/factory";
