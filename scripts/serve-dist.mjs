import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const port = Number(process.env.PORT || 5173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function safePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  const normalizedPath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  return path.join(distDir, normalizedPath === "/" ? "index.html" : normalizedPath);
}

async function fileResponse(filePath) {
  const content = await fs.readFile(filePath);
  const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";

  return { content, contentType };
}

const server = http.createServer(async (req, res) => {
  try {
    const requestPath = new URL(req.url || "/", `http://localhost:${port}`).pathname;
    let filePath = safePath(requestPath);

    try {
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }
    } catch {
      filePath = path.join(distDir, "index.html");
    }

    const { content, contentType } = await fileResponse(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(String(error.stack || error));
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Amsun production preview running at http://localhost:${port}/`);
});
