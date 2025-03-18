import { Plugin } from 'vite';
export { twneat } from './twneatClient.js';
import './utils.js';

interface TwneatPluginOptions {
    srcDir?: string;
    twneatDir?: string;
}
declare function twneatPlugin(options?: TwneatPluginOptions): Plugin[];
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
declare function regexExtractTwneatStrings(text: string): string;

export { twneatPlugin as default, regexExtractTwneatStrings };
