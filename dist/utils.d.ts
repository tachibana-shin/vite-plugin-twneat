interface BreakpointClasses {
    [breakpoint: string]: string;
}
declare function processBreakpointClasses(input: BreakpointClasses): string[];

export { type BreakpointClasses, processBreakpointClasses };
