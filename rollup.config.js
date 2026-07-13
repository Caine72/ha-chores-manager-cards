import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import serve from "rollup-plugin-serve";

const dev = process.env.ROLLUP_WATCH;

const onwarn = (warning, warn) => {
  if (warning.code === "THIS_IS_UNDEFINED" && warning.id?.includes("node_modules")) {
    return;
  }
  warn(warning);
};

export default {
  input: "src/index.ts",
  output: {
    file: "dist/ha-chores-manager-cards.js",
    format: "es",
    inlineDynamicImports: true,
    sourcemap: dev,
  },
  onwarn,
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.build.json" }),
    json(),
    dev &&
      serve({
        contentBase: ["dist"],
        host: "0.0.0.0",
        port: 5000,
        allowCrossOrigin: true,
        headers: { "Access-Control-Allow-Origin": "*" },
      }),
    !dev && terser(),
  ].filter(Boolean),
};
