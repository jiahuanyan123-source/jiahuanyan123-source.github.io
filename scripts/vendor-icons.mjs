import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const root = dirname(require.resolve("lucide/package.json"));
const { version } = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const output = new URL("../assets/vendor/", import.meta.url);
await mkdir(output, { recursive: true });
await copyFile(join(root, "dist/umd/lucide.min.js"), new URL("lucide.min.js", output));
await copyFile(join(root, "LICENSE"), new URL("lucide.LICENSE", output));
await writeFile(new URL("README.md", output), `# Lucide icons\n\nVersion: ${version}\nSource: https://github.com/lucide-icons/lucide\n\nGenerated from the locked npm package with npm run vendor:icons.\nThe license is included in lucide.LICENSE.\n`);
