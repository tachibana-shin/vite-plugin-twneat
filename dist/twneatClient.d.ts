import { type BreakpointClasses } from "./utils";
/**
 * Organize your tailwind breakpoints in neat groups, then combine them automatically and append them at the end of your file as a comment for the tailwind JIT to pick it up.
 * You must use this in conjunction with the twneat vite plugin which will regex and pick up the classes and append them to the bottom of the file as a comment.
 * The order of the vite plugin is important, it must be before the tailwindcss plugin.
 * @param {BreakpointClasses} input
 * @returns {string}
 * @example
 * // "base" is the default breakpoint (i.e. smaller than sm). base: "h-[20px] w-[40px]" will become "h-[20px] w-[40px]" - it is simply removed.
 * // returns "h-[20px] w-[40px] sm:h-[30px] sm:w-[50px] ... xl:hidden"
 * twneat({
 *  base: "h-[20px] w-[40px]",
 *  sm: "h-[30px] w-[50px]",
 *  md: "h-[40px] w-[60px]",
 *  lg: "h-[50px] w-[70px]",
 *  xl: "hidden",
 * })
 **/
export default function twneat(input: BreakpointClasses): string;
