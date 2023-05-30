import { join } from 'node:path';

import type { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import handlebars from 'handlebars';

function configureStaticAssets(app: FastifyInstance) {
  app.register(fastifyStatic, {
    root: join(__dirname, '..', '..', '..', 'static'),
  });
}

function configureTemplates(app: FastifyInstance) {
  handlebars.registerHelper(
    'ifEquals',
    function (
      this: unknown,
      arg1: string,
      arg2: string,
      options: {
        fn: (context: unknown) => string;
        inverse: (context: unknown) => string;
      },
    ) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
  );

  app.register(fastifyView, {
    engine: {
      handlebars: handlebars,
    },
    root: join(__dirname, '..', 'views'),
    layout: 'layout.hbs',
    options: {
      partials: {
        heading: 'partials/heading.hbs',
        section: 'partials/section.hbs',
        navigation: 'partials/navigation.hbs',
        'browse-navigation': 'partials/browse-navigation.hbs',
        'browse-navigation-item': 'partials/browse-navigation-item.hbs',
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
