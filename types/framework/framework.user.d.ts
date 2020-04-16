import { DocumentAuthAccount } from 'types/document';
import { FaunaDocumentOptions } from '../fauna';
import { FrameworkDocumentApi } from './framework.document';

// see https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims

export interface FrameworkAuthConnectUrlOptions {
  client_id: string;
  redirect_uri?: string;
  access_type?: string;
  response_type?: string;
  prompt?: string;
  scope?: string;
  state?: any;
}

export interface FrameworkAuthGithubConnectResponse {
  code: string;
}

export interface FrameworkAuthAuthenticateOptions {
  client_id: string;
  client_secret: string;
  code: string;
  redirect_uri?: string;
  grant_type?: string;
}

export interface FrameworkAuthAuthenticateResponse {
  access_token: string;
  state: string;
}

export interface FrameworkAuthTokenInfoOptions {
  access_token: string;
}

export interface FrameworkAuthUserInfoOptions {
  access_token: string;
}

export interface FrameworkAuthGetIdOptions {
  access_token: string;
}

export interface FrameworkUserAuthProviderDataStateApi {
  scenario?: string;
  key?: string;
  iv?: string;
  [field: string]: any;
}

export interface FrameworkUserAuthProviderDataApi {
  state?: FrameworkUserAuthProviderDataStateApi;
}

export interface FrameworkUserAuthProviderApi {
  loginUrl(options: FrameworkAuthConnectUrlOptions): Promise<string>;
  registerUrl(options: FrameworkAuthConnectUrlOptions): Promise<string>;
  syncUrl(options: FrameworkAuthConnectUrlOptions): Promise<string>;
  authenticate(options: FrameworkAuthAuthenticateOptions, data?: FrameworkUserAuthProviderDataApi): Promise<any>;
  // unsync(): Promise<any>;
}

export interface FrameworkUserSessionApi {
  get(): Promise<any>;
  expireNow(): Promise<any>;
  expireIn(delayInMs: number): Promise<any>;
  expireAt(at: number): Promise<any>;
  update(data: FaunaDocumentOptions['data']): Promise<any>;
  replace(data: FaunaDocumentOptions['data']): Promise<any>;
  delete(): Promise<any>;
  forget(): Promise<any>;
}

export interface FrameworkUserApi {
  me(): Promise<any>;
  login(email: string, password: string): Promise<any>;
  loginWithAuthAccount(account: DocumentAuthAccount): Promise<any>;
  register(email: string, password: string, data?: FaunaDocumentOptions['data']): Promise<any>;
  registerWithAuthAccount(account: DocumentAuthAccount): Promise<any>;
  changePassword(password: string): Promise<any>;
  logout(everywhere: boolean): Promise<any>;

  session: FrameworkUserSessionApi;
  google: FrameworkUserAuthProviderApi;
  github?: FrameworkUserAuthProviderApi;

  update: FrameworkDocumentApi['update'];
  replace: FrameworkDocumentApi['update'];
  delete: FrameworkDocumentApi['delete'];
  forget: FrameworkDocumentApi['forget'];

  activity: FrameworkDocumentApi['activity'];
}
