import { FaunaDocumentOptions } from "../fauna";

export interface DBFrameworkUserOAuth2DefaultApi {
  login(): Promise<any>;
  register(): Promise<any>;
  sync(): Promise<any>;
  // unsync(): Promise<any>;
}

export interface DBFrameworkUserSessionApi {
  get(): Promise<any>;
  expireNow(): Promise<any>;
  expireIn(delayInMs: number): Promise<any>;
  expireAt(at: number): Promise<any>;
  update(data: FaunaDocumentOptions["data"]): Promise<any>;
  replace(data: FaunaDocumentOptions["data"]): Promise<any>;
  delete(): Promise<any>;
  forget(): Promise<any>;
}

export interface DBFrameworkUserApi {
  me(): Promise<any>;
  login(email: string, password: string): Promise<any>;
  register(email: string, password: string, data?: FaunaDocumentOptions["data"]): Promise<any>;
  changePassword(password: string): Promise<any>;
  logout(everywhere: boolean): Promise<any>;

  session: DBFrameworkUserSessionApi;
  google: DBFrameworkUserOAuth2DefaultApi;
  github: DBFrameworkUserOAuth2DefaultApi;
}
