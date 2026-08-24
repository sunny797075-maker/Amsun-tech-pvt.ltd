import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const distDir = resolve(root, "dist");

await mkdir(resolve(distDir, "server"), { recursive: true });
await mkdir(resolve(distDir, ".openai"), { recursive: true });

await copyFile(
  resolve(root, ".openai", "hosting.json"),
  resolve(distDir, ".openai", "hosting.json")
);

await writeFile(
  resolve(distDir, "server", "index.js"),
  `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;
    const url = new URL(request.url);
    if (url.pathname.includes(".")) return response;
    return env.ASSETS.fetch(new URL("/index.html", url));
  }
};
`,
  "utf8"
);
