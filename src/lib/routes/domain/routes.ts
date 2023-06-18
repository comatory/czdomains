import type {
  FastifyInstance,
  FastifyPlugin,
  FastifyPluginOptions,
} from 'fastify';

import paramsSchema from './params.schema.json';
import { getDomain } from './get-domain';
import { getArchivedSnapshot } from './get-archived-snapshot';
import { getWhoisData } from './get-whois-data';
import type { DomainParamsSchema } from '../../types/schemas';
import { getLanguageId, intl } from '../../utils/intl';

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
      config: {
        rateLimit: {
          max: 2,
          timeWindow: '1 minute',
        },
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

      const archivedSnapshot = await getArchivedSnapshot(domain.value);
      const whoisData = await getWhoisData(domain.value);

      const language = getLanguageId(request);

      return reply.view('domain.njk', {
        domain,
        importEntry,
        archivedSnapshot,
        whoisData,
        language,
        intl: intl(language),
      });
    },
  );
  done();
}

export const domainPlugin: FastifyPlugin = plugin;
