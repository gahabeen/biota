import { FaunaRef, FaunaTime } from './fauna';

export interface DocumentGroup {
  _name: string;
}

export interface DocumentAuthAccountProfile {
  email?: string;
}

export interface OpenIDUserInfo {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
  website?: string;
  email?: string;
  email_verified?: boolean;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  address?: JSON;
  updated_at?: number;
}

export interface DocumentAuthAccount {
  provider: string;
  id: string;
  profile?: DocumentAuthAccountProfile;
  userInfo?: OpenIDUserInfo;
}

export interface DocumentAuth {
  email?: string;
  accounts?: DocumentAuthAccount[];
}

export interface DocumentMembership {
  owner?: FaunaRef;
  assignees?: FaunaRef[];
  roles?: String[];
}

export interface DocumentActivity {
  assigned_by?: FaunaRef;
  assigned_at?: FaunaTime;

  owner_changed_by?: FaunaRef;
  owner_changed_at?: FaunaTime;

  credentials_changed_by?: FaunaRef;
  credentials_changed_at?: FaunaTime;

  created_by?: FaunaRef;
  created_at?: FaunaTime;

  updated_by?: FaunaRef;
  updated_at?: FaunaTime;

  replaced_by?: FaunaRef;
  replaced_at?: FaunaTime;

  expired_by?: FaunaRef;
  expired_at?: FaunaTime;

  deleted_by?: FaunaRef;
  deleted_at?: FaunaTime;

  forgotten_by?: FaunaRef;
  forgotten_at?: FaunaTime;
}
