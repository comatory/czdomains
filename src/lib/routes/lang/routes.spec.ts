import { createTestApp } from '../../test-utils/app';
import type { TestApp } from '../../test-utils/app';

describe('lang', () => {
  let server: TestApp;

  beforeAll(async () => {
    server = await createTestApp();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should always redirect to home', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/language',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      payload: 'language=en',
    });

    expect(response.statusCode).toEqual(302);
    expect(response.headers.location).toEqual('/');
  });

  it('should set en language to a cookie', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/language',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      payload: 'language=en',
    });

    expect(response.cookies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: expect.stringMatching(/^en\./),
        }),
      ]),
    );
  });

  it('should set cz language to a cookie', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/language',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      payload: 'language=cz',
    });

    expect(response.cookies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: expect.stringMatching(/^cz\./),
        }),
      ]),
    );
  });
});
