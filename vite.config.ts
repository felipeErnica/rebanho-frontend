import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve("./src"),
            "@features": path.resolve("./src/components/features"),
            "@shared": path.resolve("./src/components/shared"),
            "@utils": path.resolve("./src/utils"),
        }
    },
    plugins: [
        react(),
        tailwindcss(),


        electron({
            main: {
                entry: 'electron/main.ts',
            },
            preload: {
                input: path.join(__dirname, 'electron/preload.ts'),
            },
            renderer: {},
        }),
    ],
})
