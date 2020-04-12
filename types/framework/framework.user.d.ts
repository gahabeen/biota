import { FaunaDocumentOptions, FaunaPaginateOptions } from '../fauna';
import { DocumentAuthAccount } from 'types/document';

// see https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims

export interface BiotaFrameworkAuthConnectUrlOptions {
  client_id: string;
  redirect_uri?: string;
  access_type?: string;
  response_type?: string;
  prompt?: string;
  scope?: string;
  state?: any;
}

export interface BiotaFrameworkAuthGithubConnectResponse {
  code: string;
}

export interface BiotaFrameworkAuthAuthenticateOptions {
  client_id: string;
  client_secret: string;
  code: string;
  redirect_uri?: string;
  grant_type?: string;
}

export interface BiotaFrameworkAuthAuthenticateResponse {
  access_token: string;
  state: string;
}

export interface BiotaFrameworkAuthTokenInfoOptions {
  access_token: string;
}

export interface BiotaFrameworkAuthUserInfoOptions {
  access_token: string;
}

export interface BiotaFrameworkAuthGetIdOptions {
  access_token: string;
}

export interface BiotaFrameworkUserAuthProviderDataStateApi {
  scenario?: string;
  key?: string;
  iv?: string;
  [field: string]: any;
}

export interface BiotaFrameworkUserAuthProviderDataApi {
  state?: BiotaFrameworkUserAuthProviderDataStateApi;
}

export interface BiotaFrameworkUserAuthProviderApi {
  loginUrl(options: BiotaFrameworkAuthConnectUrlOptions): Promise<string>;
  registerUrl(options: BiotaFrameworkAuthConnectUrlOptions): Promise<string>;
  syncUrl(options: BiotaFrameworkAuthConnectUrlOptions): Promise<string>;
  authenticate(options: BiotaFrameworkAuthAuthenticateOptions, data?: BiotaFrameworkUserAuthProviderDataApi): Promise<any>;
  // unsync(): Promise<any>;
}

export interface BiotaFrameworkUserSessionApi {
  get(): Promise<any>;
  expireNow(): Promise<any>;
  expireIn(delayInMs: number): Promise<any>;
  expireAt(at: number): Promise<any>;
  update(data: FaunaDocumentOptions['data']): Promise<any>;
  replace(data: FaunaDocumentOptions['data']): Promise<any>;
  delete(): Promise<any>;
  forget(): Promise<any>;
}

export interface BiotaFrameworkUserApi {
  me(): Promise<any>;
  login(email: string, password: string): Promise<any>;
  loginWithAuthAccount(account: DocumentAuthAccount): Promise<any>;
  register(email: string, password: string, data?: FaunaDocumentOptions['data']): Promise<any>;
  registerWithAuthAccount(account: DocumentAuthAccount): Promise<any>;
  changePassword(password: string): Promise<any>;
  logout(everywhere: boolean): Promise<any>;

  update(data: FaunaDocumentOptions['data']): Promise<any>;
  replace(data: FaunaDocumentOptions['data']): Promise<any>;
  delete(): Promise<any>;
  forget(): Promise<any>;

  activity(pagination?: FaunaPaginateOptions): Promise<any>;

  session: BiotaFrameworkUserSessionApi;
  google: BiotaFrameworkUserAuthProviderApi;
  github?: BiotaFrameworkUserAuthProviderApi;
}
