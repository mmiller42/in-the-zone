import { readFile } from "fs/promises";
import { resolve } from "path";
import { execa, ExecaError } from "execa";

async function runJest(TZ) {
  try {
    await execa({
      stdout: "inherit",
      stderr: "inherit",
      env: { TZ },
    })`npx jest`;
  } catch (e) {
    if (e instanceof ExecaError) {
      throw Object.assign(
        new Error(`TZ="${TZ}" npx jest exited with ${e.exitCode}`),
        { cause: e }
      );
    }

    throw e;
  }
}

async function main() {
  console.log("generating fixtures...");
  await execa({ cwd: import.meta.dirname })`node ./generate.mjs`;

  console.log("importing fixtures...");
  const fixtures = JSON.parse(
    await readFile(resolve(import.meta.dirname, "fixtures.json"), "utf-8")
  );
  const timezones = Object.keys(Object.values(fixtures)[0]);

  for (const timezone of timezones) {
    console.log(`\n\n\n\ntimezone = ${timezone}`);

    await runJest(timezone);
  }
}

main().catch((error) => console.error(error.message));
