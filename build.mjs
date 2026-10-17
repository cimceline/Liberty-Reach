import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const minify = process.argv.includes("--minify");

const options = {
  entryPoints: [path.join(root, "client/src/index.jsx")],
  bundle: true,
  outfile: path.join(root, "client/dist/bundle.js"),
  loader: { ".js": "jsx", ".jsx": "jsx" },
  jsx: "automatic",
  minify,
  sourcemap: !minify,
  target: ["es2019"],
  logLevel: "info",
};

if (process.argv.includes("--watch")) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log("[esbuild] watching client/src ...");
} else {
  await esbuild.build(options);
}
