import type {
  FastifyInstance,
  FastifyPlugin,
  FastifyPluginOptions,
} from 'fastify';

import confirmBodySchema from './confirm.body.schema.json';
import submitQueryStringSchema from './submit.querystring.schema.json';
import type {
  SubmitQuerystringSchema,
  SubmitConfirmationBodySchema,
} from '../../types/schemas.d';
import { searchDomain } from './search-domain';
import { sendSubmission } from './send-submission';

function validateDomainInput(input: string) {
  return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.cz$/.test(input);
}

function plugin(
  server: FastifyInstance,
  _options: FastifyPluginOptions,
  done: () => void,
) {
  server.get<{
    Querystring: SubmitQuerystringSchema;
  }>(
    '/',
    {
      schema: {
        querystring: submitQueryStringSchema,
      },
    },
    async (request, reply) => {
      const sent = Boolean(request.query.sent);

      return reply.view('submit.njk', {
        valid: true,
        sent,
      });
    },
  );

  server.post<{
    Body: SubmitConfirmationBodySchema;
  }>(
    '/confirm',
    {
      schema: {
        body: confirmBodySchema,
      },
    },
    async (request, reply) => {
      const { email, domain } = request.body;
      const existingDomain = await searchDomain(server.services.db, domain);
      const valid = validateDomainInput(domain);

      if (existingDomain || !valid) {
        return reply.view('submit.njk', {
          domain: existingDomain,
          email,
          query: domain,
          valid,
        });
      }

      const submissionSent = await sendSubmission({
        email,
        domain,
      });

      return reply.redirect(`/submit?sent=${submissionSent}`);
    },
  );

  done();
}

export const submitPlugin: FastifyPlugin = plugin;
