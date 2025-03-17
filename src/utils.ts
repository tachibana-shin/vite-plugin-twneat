export interface BreakpointClasses {
  [breakpoint: string]: string;
}

export function processBreakpointClasses(input: BreakpointClasses): string[] {
  if (!input || typeof input !== "object") {
    throw new Error("Input must be an object");
  }

  if (Object.keys(input).length === 0) {
    throw new Error("Input object must not be empty");
  }

  return Object.entries(input).flatMap(([breakpoint, classListString]) => {
    // Skip if class string is empty or just whitespace
    if (!classListString || classListString.trim() === "") return [];

    // Split the class string and apply the breakpoint prefix
    return classListString
      .trim()
      .split(/\s+/)
      .map((cls) => (breakpoint === "base" ? cls : `${breakpoint}:${cls}`));
  });
}
