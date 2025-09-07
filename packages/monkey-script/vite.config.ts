import type { ViteDevServer } from 'vite';

import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export function pluginWatchNodeModules(modules: string[]) {
    // Merge module into pipe separated string for RegExp() below.
    const pattern = `/node_modules\\/(?!${modules.join('|')}).*/`;
    return {
        name: 'watch-node-modules',
        configureServer: (server: ViteDevServer): void => {
            server.watcher.options = {
                ...server.watcher.options,
                ignored: [new RegExp(pattern), '**/.git/**'],
            };
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        pluginWatchNodeModules(['simple-gamepad-navigation']),
        monkey({
            entry: 'src/main.ts',
            userscript: {
                name: 'Simple Gamepad Navigation',
                description: 'Navigate (almost) any accessible website with a controller.',
                icon: 'https://raw.githubusercontent.com/miniwangdali/SimpleGamepadNavigation/refs/heads/main/packages/monkey-script/asset/icon.svg',
                namespace: 'https://miniwangdali.github.io/simple-gamepad-navigation/',
                match: ['*://*/*'],
                license: 'MIT',
            },
        }),
    ],
});
