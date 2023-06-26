import { FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyFormBody from '@fastify/formbody';

function configureCookie(server: FastifyInstance) {
  server.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET as string,
  });
}

function configureFormBody(server: FastifyInstance) {
  server.register(fastifyFormBody);
}

export function configureParsers(server: FastifyInstance) {
  configureCookie(server);
  configureFormBody(server);
}
