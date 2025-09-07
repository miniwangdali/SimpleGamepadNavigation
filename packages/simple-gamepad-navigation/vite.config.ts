import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'SimpleGamepadNavigation',
            fileName: 'index',
        },
        minify: false,
        rollupOptions: {
            plugins: [typescript()],
        },
    },
});
