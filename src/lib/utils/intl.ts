import type { FastifyRequest } from 'fastify';

const localisations = {
  locales: ['en', 'cz'],
  messages: {
    en: {
      home: {
        about:
          'Simple database of Czechia TLD domains which were registered in the past. You can search by its name to get its detail.',
      },
    },
    cz: {
      home: {
        about:
          'Jednoduchá databáze domén s českou koncovkou, které byly v minulosti registrovány. Můžete vyhledávat podle názvu, abyste získali podrobnosti.',
      },
    },
  },
};

type LocalisedMessages = (typeof localisations.messages)['en' | 'cz'];

function isValidValue(value: string | null): value is 'en' | 'cz' {
  return value === 'en' || value === 'cz';
}

export function intl(language: 'en' | 'cz'): LocalisedMessages {
  return localisations.messages[language];
}

export function getLanguageId(request: FastifyRequest): 'en' | 'cz' {
  const cookie = request.cookies?.language;
  const value = cookie ? request.unsignCookie(cookie)?.value : null;
  const language = isValidValue(value) ? value : 'en';

  return language;
}
