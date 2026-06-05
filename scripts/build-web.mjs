import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const wwwDir = path.join(projectRoot, "www");

const filesToCopy = ["index.html", "style.css", "script.js"];

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function buildWeb() {
  // 1) Clean old www output so every build is fresh.
  await rm(wwwDir, { recursive: true, force: true });
  await mkdir(wwwDir, { recursive: true });

  // 2) Copy required top-level web files.
  for (const fileName of filesToCopy) {
    const sourcePath = path.join(projectRoot, fileName);
    const destPath = path.join(wwwDir, fileName);
    await copyFile(sourcePath, destPath);
  }

  // 3) Copy assets folder if it exists.
  const assetsSource = path.join(projectRoot, "assets");
  const assetsDest = path.join(wwwDir, "assets");
  if (await pathExists(assetsSource)) {
    await cp(assetsSource, assetsDest, { recursive: true });
  }

  // 4) Copy local Three.js runtime files so the web build always has them.
  const libsSource = path.join(projectRoot, "libs");
  const libsDest = path.join(wwwDir, "libs");
  if (await pathExists(libsSource)) {
    await cp(libsSource, libsDest, { recursive: true });
  }

  console.log("Web build complete: copied files into ./www");
}

buildWeb().catch((error) => {
  console.error("Web build failed:");
  console.error(error);
  process.exit(1);
});
