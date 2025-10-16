import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),  // ignora a pasta de build
  {
    files: ['**/*.{ts,tsx}'],  // aplica as regras apenas em TS/TSX
    extends: [
      js.configs.recommended,                  // regras JS recomendadas
      tseslint.configs.recommended,            // regras TS recomendadas
      reactHooks.configs['recommended-latest'], // boas práticas React Hooks
      reactRefresh.configs.vite,               // regras específicas do Vite
    ],
    languageOptions: {
      ecmaVersion: 2020,  // padrão JS moderno
      globals: globals.browser, // reconhece variáveis globais do browser
    },
  },
])
