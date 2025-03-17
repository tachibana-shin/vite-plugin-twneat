import fs from "fs";
import JSON5 from "json5";
import path from "path";
import { processBreakpointClasses } from "./utils";
export function processFile(inputFilePath, srcDir, twneatDir) {
    try {
        if (!fs.existsSync(inputFilePath)) {
            throw new Error(`Input file not found: ${inputFilePath}`);
        }
        const originalContent = fs.readFileSync(inputFilePath, "utf8");
        const ret = regexExtractTwneatStrings(originalContent);
        const outputFilePath = path.join(twneatDir, path
            .relative(srcDir, inputFilePath)
            .replace(/[\/\\]/g, "_")
            .replace(path.extname(inputFilePath), ".twneat"));
        fs.writeFileSync(outputFilePath, ret, "utf8");
        return;
    }
    catch (error) {
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
export function regexExtractTwneatStrings(text) {
    const regex = /twneat\(\s*({[^}]+})\s*\)/g;
    const matches = [...text.matchAll(regex)];
    const twNeatObjects = matches.map((match) => {
        try {
            return JSON5.parse(match[1]);
        }
        catch (e) {
            throw new Error(`twneat: failed to parse: ${match[1]}`);
        }
    });
    if (twNeatObjects.length === 0) {
        return "";
    }
    const retSet = new Set();
    twNeatObjects.forEach((obj) => {
        processBreakpointClasses(obj).forEach((cls) => retSet.add(cls));
    });
    return Array.from(retSet).join(" ");
}
//# sourceMappingURL=twneatPlugin.js.map