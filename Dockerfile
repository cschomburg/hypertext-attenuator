# Frontpage

FROM node:lts-alpine AS frontpage
RUN npm install -g http-server

WORKDIR /app
COPY frontpage/package*.json ./
RUN npm install

COPY frontpage/ ./
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]

# Relay server

FROM hayd/alpine-deno:1.8.1 as relay
EXPOSE 8000

WORKDIR /app
USER deno
COPY relay/src/deps.ts ./src/deps.ts
RUN deno cache src/deps.ts

ADD relay/ ./
RUN deno cache src/app.ts
CMD ["run", "--allow-env", "--allow-net", "--allow-read=.", "src/app.ts"]

# Combined image

FROM relay
COPY --from=frontpage /app/dist/ ./static/
