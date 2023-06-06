import fastify from 'fastify';

import { configureViews } from './config/view';
import { configureServices } from './config/services';
import { configureRoutes as configureBrowseRoutes } from './routes/browse/routes';

const PORT = Number.isNaN(Number(process.env.PORT))
  ? 3000
  : Number(process.env.PORT);

void (async function () {
  const server = await configureServices(fastify());
  configureViews(server);

  server.get('/ping', async (_, __) => {
    return 'pong\n';
  });

  configureBrowseRoutes(server);

  server.get('/', async (_, reply) => {
    return reply.view('index.njk');
  });

  server.listen({ port: PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
})();
