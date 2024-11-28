FROM node:18-alpine3.20

WORKDIR /app
VOLUME data
EXPOSE 3000

COPY package.json package-lock.json tsconfig.json .nvmrc /app/
COPY src /app/src
COPY static /app/static

COPY .env /app

RUN npm ci
RUN echo "DB_PATH=./data/sqlite.db" >> /app/.env
RUN echo "PORT=3000" >> /app/.env
RUN echo "HOST=0.0.0.0" >> /app/.env

CMD ["npm", "run", "start:ci"]
