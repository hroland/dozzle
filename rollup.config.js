import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import vue from "rollup-plugin-vue";
import css from "rollup-plugin-css-only";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "assets/main.js",
  output: {
    file: "static/bundle.es.js",
    format: "es",
  },
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development"),
    }),
    resolve(),
    commonjs(),
    css(),
    vue({ css: false }),
    json(),
    production && terser(), // minify, but only in production
  ],
};
