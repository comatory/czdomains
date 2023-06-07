import type {
  FastifyInstance,
  FastifyPlugin,
  FastifyPluginOptions,
} from 'fastify';

import queryStringSchema from './querystring.schema.json';
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

      return reply.code(200).send({
        ok: true,
      });
    },
  );

  done();
}

export const searchPlugin: FastifyPlugin = plugin;
