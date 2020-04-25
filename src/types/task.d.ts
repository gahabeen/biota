export interface Task {
  name: string;
  metadata?: object;
  task(ctx: object, debug: (...args: any[]) => void): Promise<any>;
  fullError?: boolean;
}

export interface TaskExecuteOptions {
  indent?: number;
  singleResult?: boolean;
  domain?: string;
  parallel?: boolean;
  batchSize?: number;
}
