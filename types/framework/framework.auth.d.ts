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
