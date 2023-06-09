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
  server.get('/', async (request, reply) => {
    const lastImport = await getLastImport(server.services.db);
    const languageCookie = request.cookies.language
      ? request.unsignCookie(request.cookies.language)
      : null;

    return reply.view('index.njk', {
      lastImport,
      language: languageCookie?.value ?? 'en',
    });
  });

  done();
}

export const indexPlugin: FastifyPlugin = plugin;
