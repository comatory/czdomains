import { createApp } from '../app';

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type TestApp = UnwrapPromise<ReturnType<typeof createApp>>;

export async function createTestApp(): Promise<TestApp> {
  return await createApp();
}
