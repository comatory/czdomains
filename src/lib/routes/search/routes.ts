import type {
  FastifyInstance,
  FastifyPlugin,
  FastifyPluginOptions,
} from 'fastify';

import queryStringSchema from './querystring.schema.json';
import { searchDomains } from './search-domains';
import { getLanguageId, intl } from '../../utils/intl';
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
      const { page, size, q } = request.query;
      const { rows, totalCount } = await searchDomains(server.services.db, {
        page,
        size,
        q,
      });

      const language = getLanguageId(request);

      return reply.view('search.njk', {
        list: rows,
        page,
        totalCount,
        size,
        search: q,
        intl: intl(language),
        language,
      });
    },
  );

  done();
}

export const searchPlugin: FastifyPlugin = plugin;
