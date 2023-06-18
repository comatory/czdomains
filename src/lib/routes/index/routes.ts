import type {
  FastifyInstance,
  FastifyPlugin,
  FastifyPluginOptions,
} from 'fastify';

import { getLastImport } from './get-last-import';
import { intl, getLanguageId } from '../../utils/intl';

export function plugin(
  server: FastifyInstance,
  _options: FastifyPluginOptions,
  done: () => void,
) {
  server.get('/', async (request, reply) => {
    const lastImport = await getLastImport(server.services.db);
    const language = getLanguageId(request);

    return reply.view('index.njk', {
      lastImport,
      intl: intl(language),
      language,
    });
  });

  done();
}

export const indexPlugin: FastifyPlugin = plugin;
