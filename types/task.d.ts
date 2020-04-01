export interface Task {
  name: string;
  metadata?: object;
  task(ctx: object): Promise<any>;
  fullError?: boolean;
}

export interface TaskExecuteOptions {
  indent?: number,
  singleResult?: boolean
  domain?: string
}
