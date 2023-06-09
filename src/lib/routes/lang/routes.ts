import type {
  FastifyInstance,
  FastifyPlugin,
  FastifyPluginOptions,
} from 'fastify';

import type { LanguageBodySchema } from '../../types/schemas.d';
import languageBodySchema from './body.schema.json';

export function plugin(
  server: FastifyInstance,
  _options: FastifyPluginOptions,
  done: () => void,
) {
  server.post<{
    Body: LanguageBodySchema;
  }>('/', { schema: { body: languageBodySchema } }, (request, reply) => {
    const { language } = request.body;

    reply.setCookie('language', language, {
      path: '/',
      signed: true,
    });

    reply.redirect('/');
  });
  done();
}

export const languagePlugin: FastifyPlugin = plugin;
