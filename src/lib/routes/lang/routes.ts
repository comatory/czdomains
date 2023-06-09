import type {
  FastifyInstance,
  FastifyPlugin,
  FastifyPluginOptions,
} from 'fastify';

export function plugin(
  server: FastifyInstance,
  _options: FastifyPluginOptions,
  done: () => void,
) {
  server.post('/', (request, reply) => {
    const { language } = request.body;
    console.log('hit', language);

    reply.setCookie('language', language, {
      path: '/',
      signed: true,
    });

    reply.redirect('/');
  });
  done();
}

export const languagePlugin: FastifyPlugin = plugin;
