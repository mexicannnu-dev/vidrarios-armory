import {defineConfig} from 'vite';
import {cpSync, copyFileSync} from 'node:fs';

export default defineConfig({
    base: '/',
    esbuild: {jsx: 'automatic'},
    plugins: [{
        name: 'copy-static-assets',
        closeBundle() {
            cpSync('assets', 'dist/assets', {recursive: true});
            copyFileSync('CNAME', 'dist/CNAME');
        }
    }]
});
