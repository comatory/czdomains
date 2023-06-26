import type { FastifyInstance } from 'fastify';

import { createDatabase } from '../services/db';

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type Services = UnwrapPromise<ReturnType<typeof createServices>>;

async function createServices() {
  const db = await createDatabase();

  return {
    db,
  };
}

export async function configureServices(
  app: FastifyInstance,
): Promise<FastifyInstance> {
  const services = await createServices();

  app.decorate('services', services);

  return app;
}
