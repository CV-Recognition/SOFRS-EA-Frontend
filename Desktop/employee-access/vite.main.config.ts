import { defineConfig } from "vite";

// https://vitejs.dev/config
// Externalize native Node.js packages so Vite doesn't try to bundle them.
export default defineConfig({
    build: {
        rollupOptions: {
            external: [
                "ws",
                "bufferutil",
                "utf-8-validate",
                "onnxruntime-node",
            ],
        },
    },
});
