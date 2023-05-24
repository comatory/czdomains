import { join } from 'path';

import Postgrator from 'postgrator';
import sqlite3 from 'sqlite3';
import {  open } from 'sqlite';
import type { Database } from 'sqlite';
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

const list = async (client: Database<sqlite3.Database, sqlite3.Statement>) => {
  const rows = await client.all<{
    name: string;
    version: string;
    md5: string;
  }[]>('SELECT * FROM migrations;');

  for (const row of rows) {
    console.log(`${row.md5}: ${row.name}`);
  }
};

const migrate = async (client: Database<sqlite3.Database, sqlite3.Statement>, version?: string) => {
  const postgrator = new Postgrator({
    driver: 'sqlite3',
    migrationPattern: join(__dirname, 'lib', '/migrations/*.sql'),
    schemaTable: 'migrations',
    execQuery: (query) => client.all(query),
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
  sqlite3.verbose();
  const client = await open<sqlite3.Database, sqlite3.Statement>({
    filename: join(__dirname, '..', 'sqlite.db'),
    driver: sqlite3.Database,
  });

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
