import * as GetDomainModule from './get-domain';
import * as GetArchivedSnapshotModule from './get-archived-snapshot';
import * as GetWhoisDataModule from './get-whois-data';
import type { TestApp } from '../../test-utils/app';
import { createTestApp } from '../../test-utils/app';
import { domain } from '../../models/domain';
import { importEntry } from '../../models/import';

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

  it('should render template with link to the domain', async () => {
    getDomainSpy.mockResolvedValue({
      domain: domain.parse({
        id: 1,
        uuid: '1234-abcd',
        value: 'goto.cz',
      }),
      importEntry: null,
    });

    const response = await server.inject({
      method: 'GET',
      url: '/domain/1234-abcd',
    });

    expect(response.payload).toEqual(expect.stringContaining('goto.cz'));
  });

  it('should render template with added date', async () => {
    getDomainSpy.mockResolvedValue({
      domain: domain.parse({
        id: 1,
        uuid: '1234-abcd',
        value: 'goto.cz',
      }),
      importEntry: importEntry.parse({
        id: 100,
        created_at: new Date(Date.UTC(2021, 0, 1)).toString(),
      }),
    });

    const response = await server.inject({
      method: 'GET',
      url: '/domain/1234-abcd',
    });

    expect(response.payload).toEqual(
      expect.stringContaining('1/1/2021, 12:00:00 AM'),
    );
  });

  it('should NOT render archive link if snapshot is not available', async () => {
    getDomainSpy.mockResolvedValue({
      domain: domain.parse({
        id: 1,
        uuid: '1234-abcd',
        value: 'example.cz',
      }),
      importEntry: null,
    });
    getArchivedSnapshotSpy.mockResolvedValue(null);

    const response = await server.inject({
      method: 'GET',
      url: '/domain/1234-abcd',
    });

    expect(response.payload).toEqual(
      expect.not.stringContaining('archive.org'),
    );
  });

  it('should contain archive link and archival date if snapshot is available', async () => {
    getDomainSpy.mockResolvedValue({
      domain: domain.parse({
        id: 1,
        uuid: '1234-abcd',
        value: 'example.cz',
      }),
      importEntry: null,
    });
    getArchivedSnapshotSpy.mockResolvedValue({
      archived_snapshots: {
        closest: {
          url: 'https://archive.org/web/example.com',
          status: 200,
          timestamp: new Date(Date.UTC(2021, 2, 3)),
          available: true,
        },
      },
    });

    const response = await server.inject({
      method: 'GET',
      url: '/domain/1234-abcd',
    });

    expect(response.payload).toEqual(
      expect.stringContaining('https://archive.org'),
    );
    expect(response.payload).toEqual(
      expect.stringContaining('3/3/2021, 12:00:00 AM'),
    );
  });

  it('should render whois data if available', async () => {
    getDomainSpy.mockResolvedValue({
      domain: domain.parse({
        id: 1,
        uuid: '1234-abcd',
        value: 'example.cz',
      }),
      importEntry: null,
    });
    getWhoisDataSpy.mockResolvedValue({
      create_date: new Date(Date.UTC(2021, 2, 3)),
      update_date: new Date(Date.UTC(2022, 1, 1)),
      expire_date: new Date(Date.UTC(2028, 0, 1)),
      domain_age: 365 * 5,
    });

    const response = await server.inject({
      method: 'GET',
      url: '/domain/1234-abcd',
    });

    expect(response.payload).toEqual(
      expect.stringContaining('3/3/2021, 12:00:00 AM'),
    );
  });
});
