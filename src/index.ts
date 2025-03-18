import fs from "fs";
import { glob } from "glob";
import JSON5 from "json5";
import path from "path";
import type { Plugin } from "vite";
import { type BreakpointClasses, processBreakpointClasses } from "./utils";

interface TwneatPluginOptions {
  srcDir?: string; // Optional source directory path
  twneatDir?: string; // Optional twneat directory path
}

// Create twneat directory if it doesn't exist
function createSafelistDir(twneatDir: string | undefined): void {
  if (!twneatDir) {
    throw new Error(`twneat: twneatDir is not defined`);
  }
  if (!fs.existsSync(twneatDir)) {
    try {
      fs.mkdirSync(twneatDir, { recursive: true });
      console.log(`Created twneat directory: ${twneatDir}`);
    } catch (error) {
      throw new Error(`twneat: failed to create directory: ${twneatDir}`);
    }
  }
}

// This plugin does not convert the code. It just creates tailwind safelist files with a ".twneat" extension.
// Tailwind safelist files cannot be put in gitignore. Tailwind will also ignore them.
function twneatPlugin(options: TwneatPluginOptions = {}): Plugin[] {
  const srcDirectory = options.srcDir || "src";
  const twneatDirectory = options.twneatDir || `${srcDirectory}/twneat`;

  const processTwneatFile = (
    filePath: string,
    fileContent: string
  ): boolean => {
    if (fileContent.includes("twneat(")) {
      const twneatDir = path.resolve(process.cwd(), twneatDirectory);
      const srcDir = path.resolve(process.cwd(), srcDirectory);

      processFile(filePath, srcDir, twneatDir);
      return true;
    }
    return false;
  };

  return [
    {
      name: "vite-plugin-twneat",
      enforce: "pre",

      // For build.
      buildStart: {
        sequential: true,
        order: "pre",
        async handler() {
          console.log(
            `🔍 twneat: Pre-processing files to generate safelist...`
          );
          createSafelistDir(options.twneatDir);
          const files = await glob(
            `${srcDirectory}/**/*.{jsx,tsx,astro,svelte,vue,js,ts,mdx,html,php,solid.js,solid.ts,component.ts,lit.js,lit.ts}`
          );
          let processedCount = 0;

          for (const file of files) {
            try {
              const filePath = path.resolve(process.cwd(), file);
              const content = fs.readFileSync(filePath, "utf-8");

              // Use the common function to process the file
              if (processTwneatFile(filePath, content)) {
                processedCount++;
              }
            } catch (error) {
              console.error(`twneat: Error processing file ${file}:`, error);
            }
          }
          console.log(
            `✅ twneat: Generated safelist for ${processedCount} files`
          );
        },
      },

      // For dev.
      transform(code: string, id: string) {
        // Ignore files that are not in the src directory
        if (!id.includes(path.resolve(process.cwd(), srcDirectory))) {
          return null;
        }

        createSafelistDir(options.twneatDir);
        if (
          /\.(jsx|tsx|astro|svelte|vue|js|ts|mdx|html|php|solid\.js|solid\.ts|component\.ts|lit\.js|lit\.ts)$/.test(
            id
          )
        ) {
          if (processTwneatFile(id, code)) {
            // The original file is not transformed, the twneat safelist file is created or modified instead.
            return null;
          }
        }
      },
    },
  ];
}

function processFile(inputFilePath: string, srcDir: string, twneatDir: string) {
  try {
    if (!fs.existsSync(inputFilePath)) {
      throw new Error(`Input file not found: ${inputFilePath}`);
    }
    const originalContent = fs.readFileSync(inputFilePath, "utf8");
    const ret = regexExtractTwneatStrings(originalContent);

    const outputFilePath = path.join(
      twneatDir,
      path
        .relative(srcDir, inputFilePath)
        .replace(/[\/\\]/g, "_")
        .replace(path.extname(inputFilePath), ".twneat")
    );
    fs.writeFileSync(outputFilePath, ret, "utf8");
    return;
  } catch (error) {
    throw new Error(`twneat: failed to process file: ${inputFilePath}`);
  }
}

/**
 * Read the readme file.
 * Process file content strings to extract twneat regex matches and then generate final tailwind strings. The matches we are looking for look like this:
 * twneat({
 *  base: "h-[20px] w-[40px]",
 *  sm: "h-[30px] w-[50px]",
 *  md: "h-[40px] w-[60px]",
 *  lg: "h-[50px] w-[70px]",
 *  xl: "hidden",
 * })
 * the "twneat(" at the start and the ")" will be removed by the regex. We are taking the inner object only.
 * That output is then parsed into an object using JSON5.
 * You can use something like split string on the ":" and the "," etc. instead of JSON5, but JSON5 just robustly ensures that
 * the original matched string was a valid object.
 * Then finally we will convert the object back into strings of only tailwind classes with the breakpoint modifier attached like "lg:h-[50px] lg:w-[70px]".
 **/
export function regexExtractTwneatStrings(text: string): string {
  const regex = /twneat\(\s*({[^}]+})\s*\)/g;
  const matches = [...text.matchAll(regex)];

  const twNeatObjects = matches.map((match) => {
    try {
      return JSON5.parse(match[1]) as BreakpointClasses;
    } catch (e) {
      throw new Error(`twneat: failed to parse: ${match[1]}`);
    }
  });
  if (twNeatObjects.length === 0) {
    return "";
  }

  const retSet = new Set<string>();
  twNeatObjects.forEach((obj) => {
    processBreakpointClasses(obj).forEach((cls) => retSet.add(cls));
  });

  return Array.from(retSet).join(" ");
}

export default twneatPlugin;

export { twneat } from "./twneatClient";

