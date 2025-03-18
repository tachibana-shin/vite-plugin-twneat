import clsx from "clsx";
import { type BreakpointClasses, processBreakpointClasses } from "./utils";

/**
 * Read the readme file. This must be used in conjunction with the twneat vite plugin.
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
function twneat(input: BreakpointClasses): string {
  return clsx(processBreakpointClasses(input));
}

export { twneat };
