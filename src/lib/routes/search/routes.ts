import type {
  FastifyInstance,
  FastifyPlugin,
  FastifyPluginOptions,
} from 'fastify';

import queryStringSchema from './querystring.schema.json';
import { searchDomains } from '../../data-utils/search-domains';
import type { SearchQueryStringSchema } from '../../types/schemas';

function plugin(
  server: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void,
) {
  server.get<{
    Querystring: SearchQueryStringSchema;
  }>(
    '/',
    {
      schema: {
        querystring: queryStringSchema,
      },
    },
    async (request, reply) => {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { page, size, q } = request.query;
      const { rows, totalCount } = await searchDomains(server.services.db, {
        page,
        size,
        q,
      });

      return reply.view('search.njk', {
        list: rows,
        page,
        totalCount,
        size,
        search: q,
      });
    },
  );

  done();
}

export const searchPlugin: FastifyPlugin = plugin;
