import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';

export async function configureRateLimit(server: FastifyInstance) {
  await server.register(rateLimit, {
    max: 60,
    timeWindow: '1 minute',
  });
}
