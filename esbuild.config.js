const esbuild = require('esbuild')
const isTest = process.argv[2] === "-t"
const { nodeExternalsPlugin } = require('esbuild-node-externals')
const TESTING = isTest
const {rm} = require("fs")
const path = require("path");
console.log(TESTING ? "Building in test mode" : "Building in production mode")

    esbuild.build({
        entryPoints: TESTING ? ['./src/index.ts', "./src/test.ts"] : ['./src/index.ts'],
        outfile: TESTING ? undefined : 'dist/index.js',
        outdir: TESTING ? 'dist' : undefined,
        bundle: true,
        minify: true,
        platform: 'node',
        sourcemap: false,
        target: 'node14',
        plugins: [nodeExternalsPlugin()]
    }).catch(() => process.exit(1))

if (!TESTING) {
rm(path.join(process.cwd(), "dist", "test.d.ts"), {force: true}, ()  => {})
}