import type {
  FastifyInstance,
  FastifyPlugin,
  FastifyPluginOptions,
} from 'fastify';

import type { LanguageBodySchema } from '../../types/schemas.d';
import languageBodySchema from './body.schema.json';

import { setLanguageCookie } from '../../utils/cookies';

export function plugin(
  server: FastifyInstance,
  _options: FastifyPluginOptions,
  done: () => void,
) {
  server.post<{
    Body: LanguageBodySchema;
  }>('/', { schema: { body: languageBodySchema } }, (request, reply) => {
    const { language } = request.body;

    setLanguageCookie(reply, language);

    reply.redirect('/');
  });
  done();
}

export const languagePlugin: FastifyPlugin = plugin;
