import type { FastifyInstance, FastifyRequest } from 'fastify';

import { setLanguageCookie } from '../utils/cookies';

function detectLanguage(request: FastifyRequest): 'en' | 'cz' {
  const header = request.headers['accept-language'];

  if (!header) {
    return 'en';
  }

  const value = header.split(',')?.[0];

  if (/^cs-*/.test(value)) {
    return 'cz';
  } else if (/^en-*/.test(value)) {
    return 'en';
  } else {
    return 'en';
  }
}

function configureLanguageHook(server: FastifyInstance) {
  server.addHook('onRequest', (request, reply, done) => {
    const languageCookie = request.cookies?.language;

    if (!languageCookie) {
      const language = detectLanguage(request);

      setLanguageCookie(reply, language);

      done();
      return;
    }

    done();
  });
}

export function configureHooks(server: FastifyInstance) {
  configureLanguageHook(server);
}
