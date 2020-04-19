import { FactoryUserApi, FactoryUser, FactoryDocumentAuthApi } from '~/types/factory/factory.user';
import { FaunaDocumentOptions, FaunaPaginateOptions } from '../fauna';

export type FrameworkUser = FactoryUser<FrameworkUserApi>;

export interface FrameworkUserAuthApi extends FactoryDocumentAuthApi<Promise<any>> {
  google: FrameworkUserAuthProviderApi;
}

export interface FrameworkUserApi {
  register: FactoryUserApi<Promise<any>>['register'];
  registerWithAuthAccount: FactoryUserApi<Promise<any>>['registerWithAuthAccount'];
  login: FactoryUserApi<Promise<any>>['login'];
  loginWithAuthAccount: FactoryUserApi<Promise<any>>['loginWithAuthAccount'];
  logout: FactoryUserApi<Promise<any>>['logout'];
  changePassword: FactoryUserApi<Promise<any>>['changePassword'];
  auth: FrameworkUserAuthApi;

  activity(pagination?: FaunaPaginateOptions): Promise<any>;
  history: FactoryUserApi<Promise<any>>['history'];
  get: FactoryUserApi<Promise<any>>['get'];
  insert: FactoryUserApi<Promise<any>>['insert'];
  update: FactoryUserApi<Promise<any>>['update'];
  upsert: FactoryUserApi<Promise<any>>['upsert'];
  replace: FactoryUserApi<Promise<any>>['replace'];
  repsert: FactoryUserApi<Promise<any>>['repsert'];
  delete: FactoryUserApi<Promise<any>>['delete'];
  forget: FactoryUserApi<Promise<any>>['forget'];
  drop: FactoryUserApi<Promise<any>>['drop'];
  restore: FactoryUserApi<Promise<any>>['restore'];
  remember: FactoryUserApi<Promise<any>>['remember'];
  expireAt: FactoryUserApi<Promise<any>>['expireAt'];
  expireIn: FactoryUserApi<Promise<any>>['expireIn'];
  expireNow: FactoryUserApi<Promise<any>>['expireNow'];
}

export interface FrameworkUserAuthProviderApi {
  loginUrl(options: FrameworkAuthConnectUrlOptions): Promise<string>;
  registerUrl(options: FrameworkAuthConnectUrlOptions): Promise<string>;
  syncUrl(options: FrameworkAuthConnectUrlOptions): Promise<string>;
  // unsync(): Promise<any>;
  authenticate(options: FrameworkAuthAuthenticateOptions, data?: FrameworkUserAuthProviderData): Promise<any>;
}

export type FrameworkUserAuthProviderDataState = {
  [key: string]: any;
};

export interface FrameworkUserAuthProviderData {
  state: FrameworkUserAuthProviderDataState;
}

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
