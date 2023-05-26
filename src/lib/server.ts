import fastify from 'fastify';

import { configureViews } from './config/view';
import { configureServices } from './config/services';

const PORT = Number.isNaN(Number(process.env.PORT))
  ? 3000
  : Number(process.env.PORT);

void (async function () {
  const instance = fastify();
  const server = await configureServices(instance);
  configureViews(server);

  server.get('/ping', async (_, __) => {
    return 'pong\n';
  });

  server.get('/', async (_, reply) => {
    return reply.view('index.hbs');
  });

  server.listen({ port: PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
})();
