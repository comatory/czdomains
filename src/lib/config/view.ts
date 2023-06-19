import { join } from 'node:path';

import type { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import nunjucks from 'nunjucks';
import { registerWith } from 'nunjucks-intl';

import { getLanguageId, localizedIntl } from '../utils/intl';

function configureInternationalization(env: typeof nunjucks) {
  registerWith(env);
}

function configureTranslations(server: FastifyInstance) {
  server.addHook('preHandler', (request, reply, done) => {
    const language = getLanguageId(request);
    const intl = localizedIntl(language);

    reply.locals = {
      language,
      intl,
    };

    done();
  });
}

function configureStaticAssets(server: FastifyInstance) {
  server.register(fastifyStatic, {
    root: join(__dirname, '..', '..', '..', 'static'),
  });
}

function configureTemplates(server: FastifyInstance) {
  server.register(fastifyView, {
    engine: {
      nunjucks,
    },
    templates: [join(__dirname, '..', 'views')],
    production: process.env.NODE_ENV === 'production',
    options: {
      noCache: process.env.NODE_ENV !== 'production',
      onConfigure: (env: typeof nunjucks) => {
        configureInternationalization(env);
      },
    },
    defaultContext: {
      language: 'en',
      intl: localizedIntl('en'),
    },
  });
}

/**
 * Sets up template rendering and static assets.
 */
export function configureViews(server: FastifyInstance) {
  configureStaticAssets(server);
  configureTemplates(server);
  configureTranslations(server);
}
