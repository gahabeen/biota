import { FaunaRef, FaunaTime } from "./fauna";

export interface DocumentAuthProvider {
  provider: string;
  id: string;
}

export interface DocumentAuth {
  providers?: DocumentAuthProvider[];
}

export interface DocumentAccess {
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

  archived_by?: FaunaRef;
  archived_at?: FaunaTime;
}
