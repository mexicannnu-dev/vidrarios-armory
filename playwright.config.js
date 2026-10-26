import {defineConfig} from '@playwright/test';

export default defineConfig({
    testDir: './tests/browser',
    use: {baseURL: 'http://127.0.0.1:4173', channel: 'msedge'},
    webServer: {command: 'npm run preview -- --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: false},
    projects: [
        {name: 'desktop', use: {viewport: {width: 1440, height: 1000}}},
        {name: 'mobile', use: {viewport: {width: 390, height: 844}}}
    ]
});
