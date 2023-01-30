# czdomains

Database of registered `.cz` (Czechia) TLD domains. Contains frontend which can
be queried. Each entry can look up an archived content on archive.org.

## Database

Entries are stored in sqlite database. Use [nessie](https://deno.land/x/nessie)
to run migrations before the first start of the app or when you make any changes
to database schema.

## Import data

Run `import:data` task to import data into database. The task expects plaintext
file with list of domain names (without `www` and/or `http(s)`) separated by new
line.

### Usage

Start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.
