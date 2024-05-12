import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { ServerOptions, defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx"],
    alias: {
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      events: 'rollup-plugin-node-polyfills/polyfills/events',
      assert: 'assert',
      Buffer: 'Buffer',
      crypto: 'crypto-browserify',
      util: 'util',
      'near-api-js': 'near-api-js/dist/near-api-js.js',
    },
  },
  define: {
    'process.env': process.env ?? {},
  },
  optimizeDeps: { // 👈 optimizedeps
    esbuildOptions: {
      target: "esnext", 
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
        //_global: '({})'
      },
      supported: { 
        bigint: true 
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({ buffer: true }),
      ],
    }
  }, 

  build: {
    target: ["esnext"], // 👈 build.target
    rollupOptions: {
      plugins: [
        nodePolyfills({ crypto: true }),
      ],
    },
  },
})
