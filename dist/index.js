import fs from "fs";
import { glob } from "glob";
import path from "path";
import { processFile } from "./twneatPlugin";
// This plugin does not convert the code. It just creates tailwind safelist files with a ".twneat" extension.
// Tailwind safelist files cannot be put in gitignore. Tailwind will also ignore them.
export function twneatPlugin(options = {}) {
    const srcDirectory = options.srcDir || "src";
    const twneatDirectory = options.twneatDir || `${srcDirectory}/twneat`;
    const processTwneatFile = (filePath, fileContent) => {
        if (fileContent.includes("twneat(")) {
            const twneatDir = path.resolve(process.cwd(), twneatDirectory);
            const srcDir = path.resolve(process.cwd(), srcDirectory);
            processFile(filePath, srcDir, twneatDir);
            return true;
        }
        return false;
    };
    return {
        name: "vite-plugin-twneat",
        enforce: "pre",
        // For build.
        buildStart: {
            sequential: true,
            order: "pre",
            async handler() {
                console.log(`🔍 twneat: Pre-processing files to generate safelist...`);
                createSafelistDir(options.twneatDir);
                const files = await glob(`${srcDirectory}/**/*.{jsx,tsx,astro,svelte}`);
                let processedCount = 0;
                for (const file of files) {
                    try {
                        const filePath = path.resolve(process.cwd(), file);
                        const content = fs.readFileSync(filePath, "utf-8");
                        // Use the common function to process the file
                        if (processTwneatFile(filePath, content)) {
                            processedCount++;
                        }
                    }
                    catch (error) {
                        console.error(`twneat: Error processing file ${file}:`, error);
                    }
                }
                console.log(`✅ twneat: Generated safelist for ${processedCount} files`);
            },
        },
        // For dev.
        transform(code, id) {
            createSafelistDir(options.twneatDir);
            if (/\.(jsx|tsx|astro|svelte)$/.test(id)) {
                if (processTwneatFile(id, code)) {
                    // The original file is not transformed, the twneat safelist file is created or modified instead.
                    return null;
                }
            }
        },
    };
}
// Create twneat directory if it doesn't exist
function createSafelistDir(twneatDir) {
    if (!twneatDir) {
        throw new Error(`twneat: twneatDir is not defined`);
    }
    if (!fs.existsSync(twneatDir)) {
        try {
            fs.mkdirSync(twneatDir, { recursive: true });
            console.log(`Created twneat directory: ${twneatDir}`);
        }
        catch (error) {
            throw new Error(`twneat: failed to create directory: ${twneatDir}`);
        }
    }
}
// Convenience.
// import { twneat } from 'vite-plugin-twneat';
// Instead of this:
// import twneat from 'vite-plugin-twneat/twneat';
export { default as twneat } from "./twneatClient";
