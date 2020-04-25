export type FrameworkScaffold = (options?: ScaffoldOptions) => Promise<any>;

export interface ScaffoldOptions {
  roles?: boolean;
  udfunctions?: boolean;
  collections?: boolean;
  indexes?: boolean;
}
