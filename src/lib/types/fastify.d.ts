/* eslint-disable */
import * as fastify from 'fastify';
import * as http from 'http';
import type sqlite3 from 'sqlite3';
import type { Database } from 'sqlite';

declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = http.Server,
    HttpRequest = http.IncomingMessage,
    HttpResponse = http.ServerResponse,
  > {
    services: {
      db: Database<sqlite3.Database, sqlite3.Statement>;
    };
  }
}
