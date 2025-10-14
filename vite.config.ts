import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [
        vue(), 
        vuetify({ autoImport: true })
    ],
    resolve: {
        extensions: ['.vue', '.js', '.ts', '.json', '.png', '.jpeg', '.svg'],
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
})
