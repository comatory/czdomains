import fastify from 'fastify';

import { configureViews } from './config/view';
import { configureServices } from './config/services';
import { getDomains } from './data-utils/domains';

const PORT = Number.isNaN(Number(process.env.PORT))
  ? 3000
  : Number(process.env.PORT);

void (async function () {
  const server = await configureServices(fastify());
  configureViews(server);

  server.get('/ping', async (_, __) => {
    return 'pong\n';
  });

  server.get('/', async (_, reply) => {
    return reply.view('index.hbs');
  });

  server.get<{
    Params: {
      filter: 'all' | 'numbers' | 'a_e' | 'f_j' | 'k_o' | 'p_t' | 'u_z';
    };
    Querystring: {
      page: number;
      size: number;
    };
  }>('/browse/:filter', async (request, reply) => {
    const { filter } = request.params;
    const { page, size } = request.query;
    const list = await getDomains(server.services.db, {
      filter,
      page,
      size,
    });

    return reply.view('browse.hbs', { list, filter: request.params.filter });
  });

  server.listen({ port: PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
})();
