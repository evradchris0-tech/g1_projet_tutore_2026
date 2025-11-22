import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/tests/setup.js',
        css: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'cobertura'],
            exclude: [
                'node_modules/',
                'src/tests/',
                '**/*.spec.js',
                '**/*.test.js',
                '**/*.test.jsx',
                'vite.config.js',
                'vitest.config.js',
                '.eslintrc.cjs',
                'setup-pipeline.ps1',
            ],
            all: true,
            lines: 30,
            functions: 40,
            branches: 40,
            statements: 40,
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})