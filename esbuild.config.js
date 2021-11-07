const esbuild = require('esbuild')

const { nodeExternalsPlugin } = require('esbuild-node-externals')

const TESTING = false

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