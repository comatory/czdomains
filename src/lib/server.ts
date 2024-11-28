import { createApp } from './app';

const PORT = Number.isNaN(Number(process.env.PORT))
  ? 3000
  : Number(process.env.PORT);
const HOST = process.env.HOST;

const DB_FILE_PATH = process.env.DB_PATH ?? 'sqlite.db';

(async () => {
  const app = await createApp({ dbFilePath: DB_FILE_PATH });

  app.listen({ port: PORT, host: HOST }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
})();
