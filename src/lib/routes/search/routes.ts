import type { Application } from '../../config/services';
import queryStringSchema from './querystring.schema.json';
import type { SearchQueryStringSchema } from '../../types/schemas';

export function configureRoutes(server: Application) {
  server.get<{
    Querystring: SearchQueryStringSchema;
  }>(
    '/search',
    {
      schema: {
        querystring: queryStringSchema,
      },
    },
    async (request, reply) => {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { page, size, q } = request.query;

      return reply.code(200).send({
        ok: true,
      });
    },
  );
}
