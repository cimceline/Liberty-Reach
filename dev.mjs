import { spawn } from "node:child_process";
import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const ctx = await esbuild.context({
  entryPoints: [path.join(root, "client/src/index.jsx")],
  bundle: true,
  outfile: path.join(root, "client/dist/bundle.js"),
  loader: { ".js": "jsx", ".jsx": "jsx", ".png": "dataurl" },
  jsx: "automatic",
  sourcemap: true,
  target: ["es2019"],
  logLevel: "info",
});
await ctx.watch();
console.log("[dev] esbuild watching client/src ...");

const server = spawn(process.execPath, ["--watch", path.join(root, "server/index.js")], {
  stdio: "inherit",
  env: { ...process.env },
});

process.on("SIGINT", () => { server.kill(); process.exit(0); });
process.on("SIGTERM", () => { server.kill(); process.exit(0); });
