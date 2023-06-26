import { createTestApp } from '../../test-utils/app';
import type { TestApp } from '../../test-utils/app';
import * as SearchDomainsModule from './search-domains';
import { domain } from '../../models/domain';

jest.mock('./search-domains');

describe('search', () => {
  let server: TestApp;
  const searchDomainsSpy = jest.spyOn(SearchDomainsModule, 'searchDomains');

  beforeEach(async () => {
    server = await createTestApp();
    searchDomainsSpy.mockResolvedValue({
      rows: [],
      totalCount: 0,
    });
  });

  afterAll(async () => {
    await server.close();
  });

  it('should search database', async () => {
    await server.inject({
      method: 'GET',
      url: '/search',
    });
    expect(searchDomainsSpy).toHaveBeenCalledTimes(1);
  });

  it('should request default page', async () => {
    await server.inject({
      method: 'GET',
      url: '/search',
    });

    const spyCall = searchDomainsSpy.mock.lastCall?.[1];

    expect(spyCall).toMatchObject({
      page: 0,
    });
  });

  it('should request default page size', async () => {
    await server.inject({
      method: 'GET',
      url: '/search',
    });

    const spyCall = searchDomainsSpy.mock.lastCall?.[1];

    expect(spyCall).toMatchObject({
      size: 20,
    });
  });

  it('should request default search query', async () => {
    await server.inject({
      method: 'GET',
      url: '/search',
    });

    const spyCall = searchDomainsSpy.mock.lastCall?.[1];

    expect(spyCall).toMatchObject({
      q: '',
    });
  });

  it('should request with given parameters', async () => {
    await server.inject({
      method: 'GET',
      url: '/search?q=test&page=2&size=10',
    });

    const spyCall = searchDomainsSpy.mock.lastCall?.[1];

    expect(spyCall).toMatchObject({
      q: 'test',
      page: 2,
      size: 10,
    });
  });

  it('should render view with search results', async () => {
    searchDomainsSpy.mockResolvedValue({
      rows: [
        domain.parse({ id: 1, value: 'example.cz', uuid: '1234-abcd' }),
        domain.parse({ id: 2, value: 'site.cz', uuid: '1234-opq' }),
        domain.parse({ id: 3, value: 'page.cz', uuid: '1234-xyz' }),
      ],
      totalCount: 3,
    });

    const response = await server.inject({
      method: 'GET',
      url: '/search?q=test&page=2&size=10',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.payload).toContain('example.cz');
    expect(response.payload).toContain('site.cz');
    expect(response.payload).toContain('page.cz');
  });
});
