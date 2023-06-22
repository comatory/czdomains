// Disabling the rule here because it's easier to include single quotes in the
// translation files when surrounded by double quotes.
/* eslint-disable quotes */
import type { FastifyRequest } from 'fastify';

const localisations = {
  locales: ['en', 'cz'],
  messages: {
    en: {
      home: {
        about:
          'Simple database of Czechia TLD domains which were registered in the past. You can search by its name to get its detail.',
        description:
          "You can retrieve domain's {link} status and WHOIS data but {emStart}beware the capacity is limited{emClose} when doing so. Submissions are welcome if the domain is not already in the database. Each submission is reviewed by the administrator.",
      },
    },
    cz: {
      home: {
        about:
          'Jednoduchá databáze domén s českou koncovkou, které byly v minulosti registrovány. Můžete vyhledávat podle názvu, abyste získali podrobnosti.',
        description:
          'Můžete získat archivní informace z {link} a WHOIS data, ale {emStart}tato činnost je kapacitně omezena{emClose}. Pokud chcete do databáze přidat novou doménu, jste vítáni, ale každý příspěvek musí být manuálně schválen.',
      },
    },
  },
};

type LocalisedMessages = (typeof localisations.messages)['en' | 'cz'];

function isValidValue(value: string | null): value is 'en' | 'cz' {
  return value === 'en' || value === 'cz';
}

export function localizedIntl(language: 'en' | 'cz'): LocalisedMessages {
  return localisations.messages[language];
}

export function getLanguageId(request: FastifyRequest): 'en' | 'cz' {
  const cookie = request.cookies?.language;
  const value = cookie ? request.unsignCookie(cookie)?.value : null;
  const language = isValidValue(value) ? value : 'en';

  return language;
}
