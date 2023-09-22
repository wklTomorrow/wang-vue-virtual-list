import vue from "rollup-plugin-vue";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.js",
  plugins: [resolve(), vue({ css: true })],
  external: ["vue"],
  output: [
    {
      format: "esm",
      file: "dist/index.js",
    },
  ],
};
