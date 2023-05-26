import fastify from 'fastify';

import { configureViews } from './config/view';

const PORT = Number.isNaN(Number(process.env.PORT))
  ? 3000
  : Number(process.env.PORT);

const server = fastify();

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
