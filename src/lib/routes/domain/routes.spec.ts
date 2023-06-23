import * as GetDomainModule from './get-domain';
import * as GetArchivedSnapshotModule from './get-archived-snapshot';
import * as GetWhoisDataModule from './get-whois-data';
import type { TestApp } from '../../test-utils/app';
import { createTestApp } from '../../test-utils/app';
import { domain } from '../../models/domain';

jest.mock('./get-domain');
jest.mock('./get-archived-snapshot');
jest.mock('./get-whois-data');

describe('domain', () => {
  let server: TestApp;

  const getDomainSpy = jest.spyOn(GetDomainModule, 'getDomain');
  const getArchivedSnapshotSpy = jest.spyOn(
    GetArchivedSnapshotModule,
    'getArchivedSnapshot',
  );
  const getWhoisDataSpy = jest.spyOn(GetWhoisDataModule, 'getWhoisData');

  afterAll(async () => {
    await server.close();
  });

  beforeEach(async () => {
    server = await createTestApp();

    getDomainSpy.mockResolvedValue({
      domain: domain.parse({
        id: 1,
        uuid: '1234-abcd',
        value: 'example.cz',
      }),
      importEntry: null,
    });

    getArchivedSnapshotSpy.mockResolvedValue(null);
    getWhoisDataSpy.mockResolvedValue(null);
  });

  it('should return 200 when domain is available', async () => {
    getDomainSpy.mockResolvedValue({
      domain: domain.parse({
        id: 1,
        uuid: '1234-abcd',
        value: 'example.cz',
      }),
      importEntry: null,
    });

    const response = await server.inject({
      method: 'GET',
      url: '/domain/1234-abcd',
    });

    expect(response.statusCode).toEqual(200);
  });

  it('should return not found when domain is not available', async () => {
    getDomainSpy.mockResolvedValue({
      domain: null,
      importEntry: null,
    });

    const response = await server.inject({
      method: 'GET',
      url: '/domain/1234-abcd',
    });

    expect(response.statusCode).toEqual(404);
  });

  it('should fetch archived snapshot when domain is available', async () => {
    getDomainSpy.mockResolvedValue({
      domain: domain.parse({
        id: 1,
        uuid: '1234-abcd',
        value: 'example.cz',
      }),
      importEntry: null,
    });

    await server.inject({
      method: 'GET',
      url: '/domain/1234-abcd',
    });

    expect(getArchivedSnapshotSpy).toHaveBeenCalledWith('example.cz');
  });

  it('should fetch whois data when domain is available', async () => {
    getDomainSpy.mockResolvedValue({
      domain: domain.parse({
        id: 1,
        uuid: '1234-abcd',
        value: 'example.cz',
      }),
      importEntry: null,
    });

    await server.inject({
      method: 'GET',
      url: '/domain/1234-abcd',
    });

    expect(getWhoisDataSpy).toHaveBeenCalledWith('example.cz');
  });

  it('should not fetch archived snapshot when domain is not available', async () => {
    getDomainSpy.mockResolvedValue({
      domain: null,
      importEntry: null,
    });

    await server.inject({
      method: 'GET',
      url: '/domain/1234-abcd',
    });

    expect(getArchivedSnapshotSpy).not.toHaveBeenCalled();
  });
});
