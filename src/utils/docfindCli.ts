import { execFile } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import type { DocFindDocument } from './contentExtractor';

export interface DocFindCliOptions {
  /** Path to the docfind binary. Defaults to "docfind" (resolved from PATH). */
  cliBinary?: string;
}

/**
 * Write documents to a JSON file and invoke the DocFind CLI to build the
 * search index. Produces `docfind.js` and `docfind_bg.wasm` in `outputDir`.
 */
export async function buildDocFindIndex(
  documents: DocFindDocument[],
  outputDir: string,
  options: DocFindCliOptions = {},
): Promise<void> {
  const binary = options.cliBinary ?? 'docfind';

  // Write the documents JSON to a temp file inside the output directory.
  await fs.mkdir(outputDir, { recursive: true });
  const jsonPath = path.join(outputDir, '_docfind_documents.json');
  await fs.writeFile(jsonPath, JSON.stringify(documents));

  try {
    await runCli(binary, [jsonPath, outputDir]);
  } finally {
    // Clean up the temporary JSON file.
    await fs.unlink(jsonPath).catch(() => {});
  }
}

function runCli(binary: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(binary, args, (error, _stdout, stderr) => {
      if (error) {
        reject(
          new Error(
            `docfind CLI failed (${binary} ${args.join(' ')}): ${stderr || error.message}`,
          ),
        );
      } else {
        resolve();
      }
    });
  });
}
