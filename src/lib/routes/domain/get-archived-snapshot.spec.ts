import { setupServer } from 'msw/node';
import { rest } from 'msw';

import { getArchivedSnapshot } from './get-archived-snapshot';

describe('getArchivedSnapshot', () => {
  const mockArchiveApiServer = setupServer();

  function mockSnapshot(
    url: string,
    options: {
      available: boolean;
      timestamp: string;
      status: string;
    },
  ) {
    mockArchiveApiServer.use(
      rest.get(`http://archive.org/wayback/available`, (req, res, ctx) => {
        if (req.url.searchParams.get('url') !== url) {
          throw new Error('Unexpected URL');
        }

        return res(
          ctx.status(Number(options.status)),
          ctx.json({
            archived_snapshots: {
              closest: {
                ...options,
                url: `http://web.archive.org/web/${options.timestamp}/${url}`,
              },
            },
          }),
        );
      }),
    );
  }

  beforeAll(() => {
    mockArchiveApiServer.listen();
  });

  afterEach(() => {
    mockArchiveApiServer.resetHandlers();
  });

  afterAll(() => {
    mockArchiveApiServer.close();
  });

  describe('success', () => {
    beforeEach(() => {
      mockSnapshot('example.cz', {
        available: true,
        timestamp: '2023030411000000',
        status: '200',
      });
    });

    it('should log fetching status', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await getArchivedSnapshot('example.cz');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Fetching internet archive snapshot: http://archive.org/wayback/available?url=example.cz',
      );
    });

    it('should log response status', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await getArchivedSnapshot('example.cz');

      expect(consoleSpy).toHaveBeenCalledWith('Response status:', 200);
    });

    it('should return snapshot', async () => {
      mockSnapshot('abcd.xyz', {
        available: true,
        timestamp: '2023030411000000',
        status: '200',
      });

      const result = await getArchivedSnapshot('abcd.xyz');

      expect(result).toMatchObject({
        archived_snapshots: {
          closest: {
            available: true,
            url: 'http://web.archive.org/web/2023030411000000/abcd.xyz',
            timestamp: expect.any(Date),
          },
        },
      });
    });
  });

  describe('failure', () => {
    it('should return null if response status is not 200', async () => {
      mockSnapshot('example.cz', {
        available: false,
        timestamp: '2023030411000000',
        status: '404',
      });

      const result = await getArchivedSnapshot('example.cz');

      expect(result).toBeNull();
    });

    it('should log error if response status is not 200', async () => {
      mockSnapshot('example.cz', {
        available: false,
        timestamp: '2023030411000000',
        status: '404',
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await getArchivedSnapshot('example.cz');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch the snapshot',
        expect.any(Error),
      );
    });
  });
});
