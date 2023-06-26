/* eslint-disable */
import * as fastify from 'fastify';
import * as http from 'http';
import type sqlite3 from 'sqlite3';
import type { Database } from 'sqlite';

import type { Services } from '../config/services';

declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = http.Server,
    HttpRequest = http.IncomingMessage,
    HttpResponse = http.ServerResponse,
  > {
    services: Services;
  }

  export interface FastifyReply extends fastify.FastifyReply {
    locals: Record<string, unknown>;
  }
}
