import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
    input: "src/index.tsx",
    output: [
        {
            file: "dist/script.jsx",
            intro: "(function () {",
            outro: "}).call(this);",
            plugins: [
                terser({
                    compress: false,
                    mangle: false,
                    format: {
                        beautify: true,
                        braces: true,
                        comments: false,
                        keep_quoted_props: true,
                        keep_numbers: true,
                        preamble: `// 本脚本基于Soil开发\n// Soil作者:  Raymond Yan (raymondclr@foxmail.com / qq: 1107677019)\n// Soil Github: https://github.com/RaymondClr/Soil\n\n// 脚本作者: loneprison (qq: 769049918)\n// Github: {未填写/未公开}\n// - ${new Date().toLocaleString()}\n`,
                        wrap_func_args: false,
                    },
                }),
            ],
        },
        {
            file: "dist/script.min.jsx",
            intro: "(function () {",
            outro: "}).call(this);",
            plugins: [
                terser({
                    compress: {
                        arrows: false,
                        arguments: true,
                        booleans: false,
                        conditionals: false,
                        evaluate: false,
                        join_vars: false,
                        keep_infinity: true,
                        sequences: false,
                        toplevel: true,
                    },
                    format: {
                        braces: true,
                    },
                }),
            ],
        },
    ],
    treeshake: {
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
    },
    plugins: [typescript()],
    context: "this",
};
