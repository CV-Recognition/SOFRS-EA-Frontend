import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        include: ["src/**/*.test.ts"],
        coverage: {
            provider: "v8",
            include: ["src/**/*.ts"],
            exclude: ["src/**/*.test.ts", "src/main.ts", "src/preload.ts"],
        },
    },
    define: {
        "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
            "http://127.0.0.1:8000",
        ),
        "import.meta.env.VITE_API_KEY": JSON.stringify("test-api-key"),
        "import.meta.env.VITE_MOBILE_SETUP_URL": JSON.stringify(""),
    },
});
