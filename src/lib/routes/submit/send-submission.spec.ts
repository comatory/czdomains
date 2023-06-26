import { setupServer } from 'msw/node';
import { rest } from 'msw';

import { sendSubmission } from './send-submission';

describe('sendSubmission', () => {
  const submissionMockServer = setupServer();

  beforeAll(() => {
    submissionMockServer.listen();
  });

  afterEach(() => {
    submissionMockServer.resetHandlers();
  });

  afterAll(() => {
    submissionMockServer.close();
  });

  function mockResponse(status: number) {
    submissionMockServer.use(
      // value from .env.test
      rest.post('http://fake_ACh1apae.xyz', (_, res, ctx) => {
        return res(ctx.status(status), ctx.text('<html>something</html>'));
      }),
    );
  }

  describe('success', () => {
    it('should log fetching status', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      mockResponse(200);

      await sendSubmission({ domain: 'example.cz', email: 'user@example.xyz' });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Submitting form to http://fake_ACh1apae.xyz with domain: example.cz, email: user@example.xyz',
      );
    });

    it('should log response status', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      mockResponse(200);

      await sendSubmission({ domain: 'example.cz', email: 'user@example.xyz' });

      expect(consoleSpy).toHaveBeenCalledWith('Response status:', 200);
    });

    it('should resolve with true', async () => {
      mockResponse(200);

      const result = await sendSubmission({
        domain: 'example.cz',
        email: 'user@example.xyz',
      });

      expect(result).toBe(true);
    });
  });

  describe('failure', () => {
    it('should reject with error when status is not 200', async () => {
      mockResponse(500);

      await expect(
        sendSubmission({ domain: 'example.cz', email: 'user@exmaple.xyz' }),
      ).rejects.toThrow('Submission failed.');
    });

    it('should log rejected error when status is not 200', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      mockResponse(500);

      await expect(
        sendSubmission({ domain: 'example.cz', email: 'user@example.syz' }),
      ).rejects.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
