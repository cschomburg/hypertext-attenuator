import { Application, HttpError, Status } from './deps.ts';
import router from './router.ts';
import { loadConfig } from './config.ts';
import store from './store.ts';

store.init(await loadConfig());

const app = new Application();

// Error handler middleware
app.use(async (context, next) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof HttpError) {
      // deno-lint-ignore no-explicit-any
      context.response.status = e.status as any;
      if (e.expose) {
        context.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>${e.status} - ${e.message}</h1>
              </body>
            </html>`;
      } else {
        context.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>${e.status} - ${Status[e.status]}</h1>
              </body>
            </html>`;
      }
    } else if (e instanceof Error) {
      context.response.status = 500;
      context.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>500 - Internal Server Error</h1>
              </body>
            </html>`;
      console.log("Unhandled Error:", e.message);
      console.log(e.stack);
    }
  }
});

app.use(async (ctx, next) => {
  await next();
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  ctx.response.headers.set('Access-Control-Allow-Origin', '*');
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (context) => {
  await context.send({
    root: `${Deno.cwd()}/static`,
    index: "index.html",
  });
});

app.addEventListener("listen", ({ hostname, port }) => {
  console.log(
    `Start listening on ${hostname}:${port}`,
  );
});

await app.listen({ port: 8000 });
