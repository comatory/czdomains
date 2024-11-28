import fastify from 'fastify';

import { configureViews } from './config/view';
import { configureServices } from './config/services';
import { configureParsers } from './config/parsers';
import { configureHooks } from './config/hooks';
import { configureRateLimit } from './config/rate-limit';
import { indexPlugin } from './routes/index/routes';
import { browsePlugin } from './routes/browse/routes';
import { searchPlugin } from './routes/search/routes';
import { domainPlugin } from './routes/domain/routes';
import { languagePlugin } from './routes/lang/routes';
import { submitPlugin } from './routes/submit/routes';

/**
 * Function that builds and runs the Fastify server.
 */
export async function createApp(options: { dbFilePath: string | undefined }) {
  const server = await configureServices(fastify(), options);

  configureParsers(server);
  configureHooks(server);
  configureViews(server);
  await configureRateLimit(server);

  server.get('/ping', async (_, __) => {
    return 'pong\n';
  });

  server.register(indexPlugin, { prefix: '/' });
  server.register(browsePlugin, { prefix: '/browse' });
  server.register(searchPlugin, { prefix: '/search' });
  server.register(domainPlugin, { prefix: '/domain' });
  server.register(languagePlugin, { prefix: '/language' });
  server.register(submitPlugin, { prefix: '/submit' });

  return server;
}
