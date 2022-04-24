FROM denoland/deno:1.20
EXPOSE 8000

WORKDIR /app
USER deno
COPY src/deps.ts ./src/deps.ts
RUN deno cache src/deps.ts

ADD . .
RUN deno cache src/app.ts
CMD ["run", "--allow-env", "--allow-net", "--allow-read=.", "src/app.ts"]
