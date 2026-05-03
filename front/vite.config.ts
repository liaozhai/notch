import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({    
    build: {
        minify: "terser",
        sourcemap: true,
    },
    resolve: {
        alias: {
            "@app": path.resolve(__dirname, "./src"),
        },
    },
});
