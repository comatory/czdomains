import type {
  FastifyInstance,
  FastifyPlugin,
  FastifyPluginOptions,
} from 'fastify';

import { getDomains } from './get-domains';
import queryStringSchema from './querystring.schema.json';
import paramsSchema from './params.schema.json';
import type { BrowseParamsSchema } from '../../types/schemas';
import type { BrowseQueryStringSchema } from '../../types/schemas';

export function plugin(
  server: FastifyInstance,
  _options: FastifyPluginOptions,
  done: () => void,
) {
  server.get<{
    Params: BrowseParamsSchema;
    Querystring: BrowseQueryStringSchema;
  }>(
    '/:filter',
    {
      schema: {
        querystring: queryStringSchema,
        params: paramsSchema,
      },
    },
    async (request, reply) => {
      const { filter } = request.params;
      const { page, size } = request.query;
      const { rows, totalCount } = await getDomains(server.services.db, {
        filter,
        page,
        size,
      });

      return reply.view('browse.njk', {
        list: rows,
        filter: request.params.filter,
        page,
        totalCount,
        size,
      });
    },
  );

  done();
}

export const browsePlugin: FastifyPlugin = plugin;
