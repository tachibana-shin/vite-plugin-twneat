import { describe, expect, it } from "vitest";
import { regexExtractTwneatStrings } from "./twneatPlugin";
describe("regexExtractTwneatStrings", () => {
    it("should ingest the contents of a file, regex twneat objects and then return a string of tailwind classes.", () => {
        const testContent = `
<div 
  class={twneat({
      base: "text-blue-500 p-4",
      sm: "text-red-500 p-6",
      md: "text-green-500 p-8",
      lg: 'hidden text-[100px] text-["#000"]',
      xl: "h-[calc(100%-4px)] w-[calc(100%-4px)]",
  })}>
  Hello World
</div>

<div 
  class={twneat({
      sm: "text-red-500 p-6",
      xl: "woooooo" 
  })}>
  Hello World 2
</div>
`;
        const expectedContent = `text-blue-500 p-4 sm:text-red-500 sm:p-6 md:text-green-500 md:p-8 lg:hidden lg:text-[100px] lg:text-["#000"] xl:h-[calc(100%-4px)] xl:w-[calc(100%-4px)] xl:woooooo`;
        const result = regexExtractTwneatStrings(testContent);
        expect(typeof result).toBe("string");
        expect(result).toBe(expectedContent);
    });
});
//# sourceMappingURL=twneatPlugin.test.js.map