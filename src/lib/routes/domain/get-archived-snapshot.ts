import { snapshot } from '../../models/snapshot';
import type { Snapshot } from '../../models/snapshot';

export async function getArchivedSnapshot(
  url: string,
): Promise<Snapshot | null> {
  try {
    const params = new URLSearchParams({
      url,
    });
    const archiveUrl = `http://archive.org/wayback/available?${params.toString()}`;
    console.log(`Fetching internet archive snapshot: ${archiveUrl}`);

    const response = await fetch(archiveUrl);

    console.log('Response status:', response.status);

    const json = await response.json();

    return snapshot.parse(json);
  } catch (e) {
    console.error('Failed to fetch the snapshot', e);
    return null;
  }
}
