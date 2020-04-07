import { Expr } from "faunadb";
import { FaunaId, FaunaDocumentOptions } from "../fauna";

export interface DBFactorySpecificUserApi {
  register(email: string, password: string, data?: FaunaDocumentOptions["data"]): Expr;
  login(email: string, password: string): Expr;
  changePassword(password: string): Expr;
}
