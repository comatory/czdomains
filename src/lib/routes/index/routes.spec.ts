import type { TestApp } from '../../test-utils/app';
import { createTestApp } from '../../test-utils/app';
import * as GetLastImportModule from './get-last-import';

jest.mock('./get-last-import');

describe('index route', () => {
  let server: TestApp;

  const getLastImportSpy = jest.spyOn(GetLastImportModule, 'getLastImport');

  beforeEach(() => {
    getLastImportSpy.mockResolvedValue(null);
  });

  beforeAll(async () => {
    server = await createTestApp();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return 200', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toEqual(200);
  });

  it('should return HTML template', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('text/html'),
    );
  });

  it('should render template with empty last import date', async () => {
    getLastImportSpy.mockResolvedValue(null);

    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.payload).toEqual(
      expect.stringContaining('Latest addition: N/A'),
    );
  });

  it('should render template with last import date', async () => {
    getLastImportSpy.mockResolvedValue(new Date(Date.UTC(2021, 0, 1)));

    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.payload).toEqual(
      expect.stringContaining('Latest addition: 1/1/2021, 12:00:00 AM'),
    );
  });

  it('should render template with default english locale when no cookie is present', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.payload).toEqual(
      expect.stringContaining('<html lang="en">'),
    );
  });

  it('should render template with czech locale when cookie is present', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
      cookies: {
        language: server.signCookie('cz'),
      },
    });

    expect(response.payload).toEqual(
      expect.stringContaining('<html lang="cz">'),
    );
  });
});
