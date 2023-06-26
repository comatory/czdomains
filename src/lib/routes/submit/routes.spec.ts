import { createTestApp } from '../../test-utils/app';
import type { TestApp } from '../../test-utils/app';
import * as SearchDomainModule from './search-domain';
import * as SendSubmissionModule from './send-submission';
import { domain } from '../../models/domain';

jest.mock('./search-domain');
jest.mock('./send-submission');

describe('submit', () => {
  let server: TestApp;
  const searchDomainSpy = jest.spyOn(SearchDomainModule, 'searchDomain');
  const sendSubmissionSpy = jest.spyOn(SendSubmissionModule, 'sendSubmission');

  beforeEach(async () => {
    server = await createTestApp();
    searchDomainSpy.mockResolvedValue(null);
    sendSubmissionSpy.mockResolvedValue(true);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('submission', () => {
    it('should render form', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/submit',
      });

      expect(response.payload).toEqual(expect.stringContaining('email'));

      expect(response.payload).toEqual(expect.stringContaining('domain'));
    });

    it('should render success message', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/submit?sent=true',
      });

      expect(response.payload).toEqual(
        expect.stringContaining('class="submission__sent"'),
      );
    });
  });

  describe('confirmation', () => {
    describe('success', () => {
      it('should redirect to submission page', async () => {
        const response = await server.inject({
          method: 'POST',
          url: '/submit/confirm',
          payload: {
            email: 'user@example.xyz',
            domain: 'example.cz',
          },
        });

        expect(response.statusCode).toEqual(302);
        expect(response.headers.location).toEqual('/submit?sent=true');
      });

      it('should verify that domain does not exist', async () => {
        await server.inject({
          method: 'POST',
          url: '/submit/confirm',
          payload: {
            email: 'user@example.xyz',
            domain: 'example.cz',
          },
        });

        const searchDomainCalls = searchDomainSpy.mock.lastCall?.[1];

        expect(searchDomainSpy).toHaveBeenCalledTimes(1);
        expect(searchDomainCalls).toEqual('example.cz');
      });

      it('should send submission', async () => {
        await server.inject({
          method: 'POST',
          url: '/submit/confirm',
          payload: {
            email: 'user@example.xyz',
            domain: 'example.cz',
          },
        });

        expect(sendSubmissionSpy).toHaveBeenCalledTimes(1);
        expect(sendSubmissionSpy).toHaveBeenCalledWith({
          email: 'user@example.xyz',
          domain: 'example.cz',
        });
      });
    });

    describe('failure', () => {
      it('should redirect to submission page with error when domain exists', async () => {
        searchDomainSpy.mockResolvedValue(
          domain.parse({
            id: 1,
            uuid: '1234-abcd',
            value: 'example.cz',
          }),
        );

        const response = await server.inject({
          method: 'POST',
          url: '/submit/confirm',
          payload: {
            email: 'user@example.xyz',
            domain: 'example.cz',
          },
        });

        expect(response.payload).toEqual(
          expect.stringContaining('class="submission__error'),
        );
      });

      it('should redirect to submission page with error when domain contains invalid TLD', async () => {
        searchDomainSpy.mockResolvedValue(null);

        const response = await server.inject({
          method: 'POST',
          url: '/submit/confirm',
          payload: {
            email: 'user@example.xyz',
            domain: 'example.com',
          },
        });

        expect(response.payload).toEqual(
          expect.stringContaining('class="submission__error'),
        );
      });

      it('should redirect to submission page with error when domain contains protocol', async () => {
        searchDomainSpy.mockResolvedValue(null);

        const response = await server.inject({
          method: 'POST',
          url: '/submit/confirm',
          payload: {
            email: 'user@example.xyz',
            domain: 'https://example.cz',
          },
        });

        expect(response.payload).toEqual(
          expect.stringContaining('class="submission__error'),
        );
      });

      it('should return 500 when submission fails', async () => {
        sendSubmissionSpy.mockRejectedValue(
          new Error('Failed to send submission'),
        );

        const response = await server.inject({
          method: 'POST',
          url: '/submit/confirm',
          payload: {
            email: 'user@example.xyz',
            domain: 'example.cz',
          },
        });

        expect(response.statusCode).toEqual(500);
      });
    });
  });
});
