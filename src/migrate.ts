import { join } from 'path';

import Postgrator from 'postgrator';
import { Database, verbose } from 'sqlite3';
import yargs from 'yargs';

const cliOptions = yargs(process.argv.slice(2))
  .option('rollback', {
    alias: 'r',
    type: 'string',
    description: 'Rollback to a specific version',
  })
  .option('list', {
    alias: 'l',
    type: 'boolean',
    description: 'List all migrations',
  })
  .help()
  .parseSync();

const list = (client: Database) => {
  client.all('SELECT * FROM migrations', (err, rows) => {
    if (err) {
      throw err;
    }

    for (const row of rows) {
      console.log(`${row.md5}: ${row.name}`);
    }
  });
};

const migrate = async (client: Database, version?: string) => {
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

  const result = await postgrator.migrate(version);

  if (result.length === 0) {
    console.log('No migrations to run');
  } else {
    console.log(`Processed ${result.length} migrations:`);
    for (const migration of result) {
      console.log(`${migration.filename}: ${migration.action}`);
    }
  }

  console.log('Migration done');
};

void (async (options: typeof cliOptions) => {
  verbose();
  const client = new Database(join(__dirname, '..', 'sqlite.db'));

  try {
    if (options.list) {
      list(client);
    } else if (options.rollback) {
      console.log(`Rolling back to ${options.rollback}`);
      await migrate(client, options.rollback);
    } else {
      await migrate(client);
    }

    process.exitCode = 0;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }

  client.close();
})(cliOptions);
