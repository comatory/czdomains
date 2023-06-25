import type {
  FastifyInstance,
  FastifyPlugin,
  FastifyPluginOptions,
} from 'fastify';

import bodySchema from './body.schema.json';
import type { SubmitConfirmationBodySchema } from '../../types/schemas.d';
import { searchDomain } from './search-domain';

function validateDomainInput(input: string) {
  return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.cz$/.test(input);
}

function plugin(
  server: FastifyInstance,
  _options: FastifyPluginOptions,
  done: () => void,
) {
  server.get('/', async (_, reply) => {
    return reply.view('submit/submit.njk');
  });

  server.post<{
    Body: SubmitConfirmationBodySchema;
  }>(
    '/confirm',
    {
      schema: {
        body: bodySchema,
      },
    },
    async (request, reply) => {
      const domainInput = request.body.domain;
      const domain = await searchDomain(server.services.db, domainInput);

      return reply.view('submit/confirm.njk', {
        domain,
        query: domainInput,
        valid: validateDomainInput(domainInput),
      });
    },
  );

  done();
}

export const submitPlugin: FastifyPlugin = plugin;
