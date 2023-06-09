import { join } from 'node:path';

import type { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import nunjucks from 'nunjucks';
import { registerWith } from 'nunjucks-intl';

function configureInternationalization(env: typeof nunjucks) {
  registerWith(env);
}

function configureStaticAssets(app: FastifyInstance) {
  app.register(fastifyStatic, {
    root: join(__dirname, '..', '..', '..', 'static'),
  });
}

function configureTemplates(app: FastifyInstance) {
  app.register(fastifyView, {
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
  });
}

/**
 * Sets up template rendering and static assets.
 */
export function configureViews(app: FastifyInstance) {
  configureStaticAssets(app);
  configureTemplates(app);
}
