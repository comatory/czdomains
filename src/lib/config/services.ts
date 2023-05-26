import type { FastifyInstance } from 'fastify';

import { createDatabase } from '../services/db';

async function createServices() {
  const db = await createDatabase();

  return {
    db,
  };
}

export async function configureServices(app: FastifyInstance) {
  const services = await createServices();

  return app.decorate('services', services);
}
