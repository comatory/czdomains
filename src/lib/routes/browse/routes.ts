import { getDomains } from '../../data-utils/domains';
import type { Application } from '../../config/services';
import queryStringSchema from './schemas/querystring.json';
import paramsSchema from './schemas/params.json';
import type { BrowseParamsSchema } from '../../types/params';
import type { BrowseQueryStringSchema } from '../../types/querystring';

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
      const list = await getDomains(server.services.db, {
        filter,
        page,
        size,
      });

      return reply.view('browse.hbs', {
        list,
        filter: request.params.filter,
        page,
        previous: false,
        next: true,
        prevPage: page - 1,
        nextPage: page + 1,
        totalPages: 100,
        size,
      });
    },
  );

  return server;
}
