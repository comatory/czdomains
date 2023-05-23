import { join } from 'path';
import Postgrator from 'postgrator';
import { Database, verbose } from 'sqlite3';

void (async () => {
  verbose();
  const client = new Database(join(__dirname, '..', 'sqlite.db'));

  try {
    const postgrator = new Postgrator({
      driver: 'sqlite3',
      migrationPattern: join(__dirname, 'lib', '/migrations/*.sql'),
      schemaTable: 'migrations',
      execQuery: async (query) => {
        return new Promise((resolve, reject) => {
          client.all(query, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve({ rows });
            }
          });
        });
      }
    });

    const result = await postgrator.migrate();

    if (result.length === 0) {
      console.log('No migrations to run');
    }

    console.log('Migration done');
    process.exitCode = 0;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    client.close();
  }
})()
