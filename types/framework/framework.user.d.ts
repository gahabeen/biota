import { FaunaDocumentOptions, FaunaPaginateOptions } from "../fauna";

export interface DBFrameworkAuthConnectUrlOptions {
  client_id: string;
  redirect_uri?: string;
  access_type?: string;
  response_type?: string;
  prompt?: string;
  scope?: string;
  state?: any;
}

export interface DBFrameworkAuthGithubConnectResponse {
  code: string;
}

export interface DBFrameworkAuthAuthenticateOptions {
  client_id: string;
  client_secret: string;
  code: string;
  redirect_uri?: string;
  grant_type?: string;
}

export interface DBFrameworkAuthAuthenticateResponse {
  access_token: string;
  state: string;
}

export interface DBFrameworkAuthTokenInfoOptions {
  access_token: string;
}

export interface DBFrameworkAuthUserInfoOptions {
  access_token: string;
}

export interface DBFrameworkAuthGetIdOptions {
  access_token: string;
}

export interface DBFrameworkUserAuthProviderServerApi {
  authenticate(): Promise<any>;
}

export interface DBFrameworkUserAuthProviderApi {
  loginUrl(options: DBFrameworkAuthConnectUrlOptions): Promise<string>;
  registerUrl(options: DBFrameworkAuthConnectUrlOptions): Promise<string>;
  syncUrl(options: DBFrameworkAuthConnectUrlOptions): Promise<string>;
  // unsync(): Promise<any>;
  server: DBFrameworkUserAuthProviderServerApi;
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

  update(data: FaunaDocumentOptions["data"]): Promise<any>;
  replace(data: FaunaDocumentOptions["data"]): Promise<any>;
  delete(): Promise<any>;
  forget(): Promise<any>;

  activity(pagination?: FaunaPaginateOptions): Promise<any>;

  session: DBFrameworkUserSessionApi;
  google: DBFrameworkUserAuthProviderApi;
  github: DBFrameworkUserAuthProviderApi;
}
