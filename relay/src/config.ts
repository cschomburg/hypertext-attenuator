import { Feed } from './model.ts';

export interface Config {
  feeds: Feed[];
}

export async function loadConfig(): Promise<Config> {
  const text = await Deno.readTextFile('config.json');
  const config = JSON.parse(text) as Config;

  return config;
}
