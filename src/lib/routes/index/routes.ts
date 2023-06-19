import type {
  FastifyInstance,
  FastifyPlugin,
  FastifyPluginOptions,
} from 'fastify';

import { getLastImport } from './get-last-import';

export function plugin(
  server: FastifyInstance,
  _options: FastifyPluginOptions,
  done: () => void,
) {
  server.get('/', async (_, reply) => {
    const lastImport = await getLastImport(server.services.db);

    return reply.view('index.njk', {
      lastImport,
    });
  });

  done();
}

export const indexPlugin: FastifyPlugin = plugin;
