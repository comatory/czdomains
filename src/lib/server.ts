import fastify from 'fastify';

import { configureViews } from './config/view';
import { configureServices } from './config/services';
import { configureParsers } from './config/parsers';
import { configureHooks } from './config/hooks';
import { indexPlugin } from './routes/index/routes';
import { browsePlugin } from './routes/browse/routes';
import { searchPlugin } from './routes/search/routes';
import { domainPlugin } from './routes/domain/routes';
import { languagePlugin } from './routes/lang/routes';

const PORT = Number.isNaN(Number(process.env.PORT))
  ? 3000
  : Number(process.env.PORT);

void (async function () {
  const server = await configureServices(fastify());
  configureParsers(server);
  configureHooks(server);
  configureViews(server);

  server.get('/ping', async (_, __) => {
    return 'pong\n';
  });

  server.register(indexPlugin, { prefix: '/' });
  server.register(browsePlugin, { prefix: '/browse' });
  server.register(searchPlugin, { prefix: '/search' });
  server.register(domainPlugin, { prefix: '/domain' });
  server.register(languagePlugin, { prefix: '/language' });

  server.listen({ port: PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
})();
