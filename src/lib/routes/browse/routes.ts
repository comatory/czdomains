import { getDomains } from '../../data-utils/domains';
import type { Application } from '../../config/services';
import queryStringSchema from './querystring.schema.json';
import paramsSchema from './params.schema.json';
import type { BrowseParamsSchema } from '../../types/schemas';
import type { BrowseQueryStringSchema } from '../../types/schemas';

export function configureRoutes(server: Application) {
  server.get<{
    Params: BrowseParamsSchema;
    Querystring: BrowseQueryStringSchema;
  }>(
    '/browse/:filter',
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

  return server;
}
