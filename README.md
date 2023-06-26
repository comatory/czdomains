# czdomains

Database of registered `.cz` (Czechia) TLD domains. Contains frontend which can
be queried. Each entry can look up an archived content on archive.org and look-up its WHOIS data.

## Prerequisites

Application requires NodeJS environment and access to file system due to data being stored in sqlite file.

Lookup service for WHOIS data is IP2Location.io and you will need API key to use it. Form for submitting new domains uses formspree.io service.
Any of these two should be easily replacable with an alternative.

## Populating database with data

You can run import script:

`npm run import -- --file [path-to-file]`

The file should include one domain per line. This script will ingest the domains and ignore any duplicates. This data is not part of this repository.

## Development

### JSON schema

Endpoints use JSON schema to define the constraints of inputs. Run `npm run schema:compile` to convert JSON schema to Typescript definitions.

### Lint & typecheck

- `npm run lint` lints the codebase.
- `npm run typecheck` runs Typescript compiler without emitting source to check for any errors

### Formatter

`npm run format`

### Test

`npm run test`

### Development server

- `npm run dev` will launch application in development mode
- `npm run dev:debug` attaches debugger

## Deployment

Make sure you have all your secrets define in `.env`, copy `.env.example` to see what these are.

Application can be started with `npm run start`. You should provide `PORT` environment variable to specify which port to run the webserver on. You can add this variable to `.env` file as well.

Before you run the application for the first time, run migration script `npm run migrate` that will set up database tables.
