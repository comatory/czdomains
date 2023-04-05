import { join } from 'node:path';

import type { FastifyInstance } from "fastify"
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import handlebars from 'handlebars';

const configureStaticAssets = (app: FastifyInstance) => {
  app.register(fastifyStatic, {
    root: join(__dirname, '..', '..', '..', 'static'),
  });
};

const configureTemplates = (app: FastifyInstance) => {
  app.register(fastifyView, {
    engine: {
      handlebars: handlebars,
    },
    layout: 'layout.hbs',
    root: join(__dirname, '..', 'views'),
  })
};

/**
 * Sets up template rendering and static assets.
 */
export const configureViews = (app: FastifyInstance) => {
  configureStaticAssets(app);
  configureTemplates(app);
}
