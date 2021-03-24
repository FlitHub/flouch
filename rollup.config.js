import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";

const EXTERNAL = [
  "jet-logger",
  "class-transformer",
  "class-validator",
  "pouchorm",
  "url",
  "path",
  "graceful-fs",
  "jsonlint",
];

const PLUGINS = [
  commonjs(),
  resolve({
    mainFields: ["module", "main"],
  }),
  typescript({
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      include: ["main.ts", "src", "spec"],
      exclude: ["node_modules", "spec", "**/*d.ts"],
    },
  }),
  terser(),
];

export default [
  {
    input: "./main.ts",
    output: {
      file: "./main.esm.js",
      format: "esm",
    },
    external: EXTERNAL,
    plugins: PLUGINS,
  },
  {
    input: "./main.ts",
    output: {
      file: "./main.js",
      format: "cjs",
    },
    external: EXTERNAL,
    plugins: PLUGINS,
  },
  {
    input: "./index.d.ts",
    output: [{ file: "lib/pouchdb-config.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
