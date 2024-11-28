import type { FastifyInstance } from 'fastify';

import { createDatabase } from '../services/db';

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type Services = UnwrapPromise<ReturnType<typeof createServices>>;

async function createServices({ dbFilePath }: { dbFilePath?: string }) {
  const db = await createDatabase({ dbFilePath });

  return {
    db,
  };
}

export async function configureServices(
  app: FastifyInstance,
  options: { dbFilePath: string | undefined },
): Promise<FastifyInstance> {
  const { dbFilePath } = options;
  const services = await createServices({ dbFilePath });

  app.decorate('services', services);

  return app;
}
