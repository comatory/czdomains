import type { FastifyInstance } from 'fastify';

import { createDatabase } from '../services/db';

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
