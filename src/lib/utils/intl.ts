// Disabling the rule here because it's easier to include single quotes in the
// translation files when surrounded by double quotes.
/* eslint-disable quotes */
import type { FastifyRequest } from 'fastify';

const localisations = {
  locales: ['en', 'cz'],
  messages: {
    en: {
      navigation: {
        home: 'Home',
        search: 'Search',
        browse: 'Browse',
        submit: 'Submit',
      },
      home: {
        about:
          'Simple database of Czechia TLD domains which were registered in the past. You can search by its name to get its detail.',
        description:
          "You can retrieve domain's {link} status and WHOIS data but {emStart}beware the capacity is limited{emClose} when doing so. Submissions are welcome if the domain is not already in the database. Each submission is reviewed by the administrator.",
        faq: {
          tldHistoryQuestion: 'What is the history of the TLD?',
          tldHistoryAnswer:
            'Originally the TLD used was .cs and it was introduced on June 4th 1991. See {source}.',
          tldCreateQuestion: 'When was the .cz TLD created?',
          tldCreateAnswer:
            'The .cz TLD was created on January 13th 1993. See {source}.',
          firstCzWebsiteQuestion: 'What was the first .cz website?',
          firstCzWebsiteAnswer:
            'The first .cz website belonged to czech community of high energy particles physicists. The website launched on June 6th 1993. See the reconstructed version here: {source}.',
        },
        attributions: {
          title: 'Attributions',
          whois: 'czdomains is using IP2Location.io {source} web service.',
          icons: 'The icons come from {source}.',
        },
        footer: {
          lastUpdate: 'Latest addition: {date}.',
          language: 'Language',
        },
      },
    },
    cz: {
      navigation: {
        home: 'Domů',
        search: 'Hledat',
        browse: 'Procházet',
        submit: 'Přidat',
      },
      home: {
        about:
          'Jednoduchá databáze domén s českou koncovkou, které byly v minulosti registrovány. Můžete vyhledávat podle názvu, abyste získali podrobnosti.',
        description:
          'Můžete získat archivní informace z {link} a WHOIS data, ale {emStart}tato činnost je kapacitně omezena{emClose}. Pokud chcete do databáze přidat novou doménu, jste vítáni, ale každý příspěvek musí být manuálně schválen.',
        faq: {
          tldHistoryQuestion: 'Jaká je historie domény?',
          tldHistoryAnswer:
            'Původně se používala TLD .cs a vznikí 4. června 1991. Odkaz: {source}.',
          tldCreateQuestion: 'Kdy vznikla .cz TLD doména?',
          tldCreateAnswer:
            '.cz doména prvního řádu vzniká 13. ledna 1993. Odkaz: {source}.',
          firstCzWebsiteQuestion: 'Co byla první česká WWW stránka?',
          firstCzWebsiteAnswer:
            'První česká WWW stránka patřila české komunitě fyziků vysokých energií. Stránka byla spuštěna 6. června 1993. Rekonstruovanou verzi můžete vidět zde: {source}.',
        },
        attributions: {
          title: 'Zdoje',
          whois: 'czdomains používají IP2Location.io {source} službu.',
          icons: 'Ikony pochází z {source}.',
        },
        footer: {
          lastUpdate: 'Poslední příspevěk: {date}.',
          language: 'Jazyk',
        },
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
