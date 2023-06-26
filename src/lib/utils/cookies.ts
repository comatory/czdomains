import type { FastifyReply } from 'fastify';

export function setLanguageCookie(reply: FastifyReply, language: 'en' | 'cz') {
  reply.setCookie('language', language, {
    path: '/',
    signed: true,
  });
}
