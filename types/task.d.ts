export interface Task {
  name: string;
  metadata?: object;
  task(ctx: object): Promise<any>;
}
