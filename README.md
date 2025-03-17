# vite-plugin-twneat

A Vite plugin that organizes Tailwind responsive prefixes into a neat and readable format. Ideal for projects using Tailwind CSS v4 and Vite.

## Problem

When working with responsive designs in Tailwind CSS, your markup can quickly become cluttered and difficult to read:

```jsx
<div className="h-[20px] w-[40px] sm:h-[30px] md:h-[40px] lg:h-[50px] sm:w-[50px] md:w-[60px] lg:w-[70px] xl:hidden">
  Content
</div>
```

## Solution

`vite-plugin-twneat` (might) help you organize your responsive classes by breakpoint, making your code more readable and maintainable:

```jsx
<div
  className={twneat({
    base: "h-[20px] w-[40px]",
    sm: "h-[30px] w-[50px]",
    md: "h-[40px] md:w-[60px]",
    lg: "h-[50px] w-[70px]",
    xl: "hidden",
  })}
>
  Content
</div>
```

The plugin automatically generates the necessary Tailwind classes and creates safelist files to ensure all classes are available during build time.

## Installation

```bash
npm install vite-plugin-twneat --save-dev
```

## Setup

### 1. Add the plugin to your Vite config

```js
// vite.config.js / vite.config.ts
import { defineConfig } from "vite";
import { twneatPlugin } from "vite-plugin-twneat";

export default defineConfig({
  plugins: [
    twneatPlugin({
      // Optional custom configuration
      srcDir: "src", // Default is 'src'
      twneatDir: "src/twneat", // Default is 'src/twneat'
    }),
    // Make sure to add the Tailwind plugin AFTER twneat
    // ...other plugins
  ],
});
```

### 2. Import the `twneat` utility in your components

```jsx
import { twneat } from "vite-plugin-twneat";

function MyComponent() {
  return (
    <div
      className={twneat({
        base: "text-blue-500 p-4",
        sm: "text-red-500 p-6",
        md: "text-green-500 p-8",
        lg: "hidden text-[100px]",
        xl: "h-[calc(100%-4px)] w-[calc(100%-4px)]",
      })}
    >
      Hello World
    </div>
  );
}
```

## How It Works and Details

1. The plugin runs a regex and extracts all objects that has the signature `twneat({})`
2. The twneat() function just concats the breakpoint with the class, then runs `clsx` over it and passes it to "className" or whatever you are using.
3. All safelist files are placed in a single directory with the original file's directory and filename (slashes replaced with underscore) and then given the extension `.twneat`.
4. During development, the plugin automatically updates the safelist files when you modify your code. During build, it pre-processes all files to generate safelists.
5. "sm: h-4 p-4" etc. will become "sm:h-4 sm:p-4" but "base: h-4 p-4" becomes "h-4, p-4" - the base is dropped.
6. I have only tested this for react and astro, but not for anything else. However it should work on any framework.

## License

MIT
