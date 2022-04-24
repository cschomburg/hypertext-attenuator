# Hypertext Attenuator

The Hypertext Attenuator is a simple web news aggregator that artifically slows
down your web browsing. Rather than showing you a constantly refreshing influx
of new posts, you have to manually request a fresh feed which only becomes
available after several minutes. It also scrapes contents and comment threads,
so that it can effectively act as proxy and you do not have to visit the site.

## Quickstart

In Deno:

```
deno run -A src/app.ts
```

In Docker:

```
docker run -it --rm -p 8000:8000 ghcr.io/cschomburg/hypertext-attenuator:latest
```

Then visit http://localhost:8000 in your browser.

A custom
[config.json](https://raw.githubusercontent.com/cschomburg/hypertext-attenuator/master/config.json)
can be mounted under `/app/config.json` or provided via env var
`HTTP_RELAY_CONFIG`.
