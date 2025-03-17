import type { Plugin } from "vite";
import twneat from "./twneatClient";
interface TwneatPluginOptions {
    srcDir?: string;
    twneatDir?: string;
}
declare function twneatPlugin(options?: TwneatPluginOptions): Plugin[];
export default twneatPlugin;
export { twneat };
