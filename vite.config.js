import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                skills: resolve(__dirname, 'skills.html'),
                projects: resolve(__dirname, 'projects.html'),
                blog: resolve(__dirname, 'blog.html'),
                contact: resolve(__dirname, 'contact.html'),
            },
        },
    },
});
