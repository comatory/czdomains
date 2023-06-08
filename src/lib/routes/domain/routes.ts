import type {
  FastifyInstance,
  FastifyPlugin,
  FastifyPluginOptions,
} from 'fastify';

import paramsSchema from './params.schema.json';
import { getDomain } from './get-domain';
import type { DomainParamsSchema } from '../../types/schemas';

export function plugin(
  server: FastifyInstance,
  _options: FastifyPluginOptions,
  done: () => void,
) {
  server.get<{
    Params: DomainParamsSchema;
  }>(
    '/:uuid',
    {
      schema: {
        params: paramsSchema,
      },
    },
    async (request, reply) => {
      const { uuid } = request.params;

      const { domain, importEntry } = await getDomain(server.services.db, {
        uuid,
      });

      if (!domain) {
        return reply.callNotFound();
      }

      return reply.view('domain.njk', {
        domain,
        importEntry,
      });
    },
  );
  done();
}

export const domainPlugin: FastifyPlugin = plugin;
