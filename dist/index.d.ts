import type { Plugin } from "vite";
interface TwneatPluginOptions {
    srcDir?: string;
    twneatDir?: string;
}
export declare function twneatPlugin(options?: TwneatPluginOptions): Plugin;
export { default as twneat } from "./twneatClient";
