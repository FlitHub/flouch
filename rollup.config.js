import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "./src/index.ts",
    output: {
      file: "./index.esm.js",
      format: "esm",
    },
    plugins: [typescript()],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./index.js",
      format: "cjs",
    },
    plugins: [typescript(), terser()],
  },
];
