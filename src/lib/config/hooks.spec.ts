import { createTestApp } from '../test-utils/app';
import type { TestApp } from '../test-utils/app';

describe('hooks', () => {
  let server: TestApp;

  afterAll(async () => {
    await server.close();
  });

  beforeEach(async () => {
    server = await createTestApp();
  });

  describe('language', () => {
    it('should set language to cz based on header', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/',
        headers: {
          'Accept-Language': 'cs-CZ',
        },
      });

      expect(response.cookies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'language',
            value: expect.stringMatching(/cz\./),
          }),
        ]),
      );
    });

    it('should set language to en based on header', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/',
        headers: {
          'Accept-Language': 'en-GB',
        },
      });

      expect(response.cookies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'language',
            value: expect.stringMatching(/en\./),
          }),
        ]),
      );
    });

    it('should set to en language if header is missing', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/',
      });

      expect(response.cookies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'language',
            value: expect.stringMatching(/en\./),
          }),
        ]),
      );
    });
  });
});
