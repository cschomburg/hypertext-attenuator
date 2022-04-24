import { Feed } from "./model.ts";

export interface Config {
  feeds: Feed[];
}

export async function loadConfig(): Promise<Config> {
  let path = "";
  try {
    path = Deno.env.get("HTTN_RELAY_CONFIG") || "";
  } catch {}
  path ||= "config.json";

  console.log("Loading config from", path);
  const text = await Deno.readTextFile(path);
  const config = JSON.parse(text) as Config;

  return config;
}
