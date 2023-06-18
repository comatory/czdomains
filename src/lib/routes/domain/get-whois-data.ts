import { whoisData } from '../../models/whoisdata';
import type { WhoisData } from '../../models/whoisdata';

export async function getWhoisData(domain: string): Promise<WhoisData | null> {
  try {
    const params = new URLSearchParams({
      key: process.env.IP2LOCATION_API_KEY as string,
      domain,
    });

    const url = `https://api.ip2whois.com/v2?${params.toString()}`;
    console.log(`Fetching WHOIS data: ${url}`);

    const response = await fetch(url);

    console.log('Response status:', response.status);

    if (response.status !== 200) {
      throw new Error('Failed to fetch the WHOIS data');
    }

    const json = await response.json();
    console.log(json);

    return whoisData.parse(json);
  } catch (e) {
    console.error('Failed to fetch the WHOIS data', e);
    return null;
  }
}
