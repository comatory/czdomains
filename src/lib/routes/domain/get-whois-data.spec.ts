import { setupServer } from 'msw/node';
import { rest } from 'msw';

import { getWhoisData } from './get-whois-data';
import { whoisData } from '../../models/whoisdata';

describe('getWhoisData', () => {
  const whoisMockServer = setupServer();

  beforeAll(() => {
    whoisMockServer.listen();
  });

  afterEach(() => {
    whoisMockServer.resetHandlers();
  });

  afterAll(() => {
    whoisMockServer.close();
  });

  function mockResponse({
    domain,
    status,
  }: {
    domain: string;
    status: number;
  }) {
    whoisMockServer.use(
      rest.get('https://api.ip2whois.com/v2', (req, res, ctx) => {
        if (req.url.searchParams.get('domain') !== domain) {
          throw new Error('Unexpected domain');
        }

        return res(
          ctx.status(status),
          ctx.json({
            domain,
          }),
        );
      }),
    );
  }

  describe('success', () => {
    it('should log fetching status', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      mockResponse({ domain: 'example.cz', status: 200 });

      await getWhoisData('example.cz');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Fetching WHOIS data: https://api.ip2whois.com/v2?key=fake_weeShe8O&domain=example.cz',
      );
    });

    it('should log response status', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      mockResponse({ domain: 'example.cz', status: 200 });

      await getWhoisData('example.cz');

      expect(consoleSpy).toHaveBeenCalledWith('Response status:', 200);
    });

    it('should return "whoisdata" object', async () => {
      mockResponse({ domain: 'example.cz', status: 200 });

      const result = await getWhoisData('example.cz');

      expect(result).toEqual(whoisData.parse({ domain: 'example.cz' }));
    });
  });

  describe('failure', () => {
    it('should log failure when status is not 200', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      mockResponse({ domain: 'example.cz', status: 500 });

      await getWhoisData('example.cz');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch the WHOIS data',
        expect.any(Error),
      );
    });
  });
});
