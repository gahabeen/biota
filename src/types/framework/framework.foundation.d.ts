export type FrameworkFoundation = (options?: FoundationOptions) => Promise<any>;

export interface FoundationOptions {
  roles?: boolean;
  udfunctions?: boolean;
  collections?: boolean;
  indexes?: boolean;
}
