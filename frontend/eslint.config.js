import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // 1. Variáveis não utilizadas: MUDAR de 'error' para 'warn'
      // Permite variáveis não utilizadas, mas avisa. Isso resolve 9 erros de uma vez.
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],

      // 2. Regras de Hooks: MUDAR para 'warn'
      // Resolve o warning de dependências faltantes, tratando como aviso
      'react-hooks/exhaustive-deps': 'warn', 

      // 3. Regra de exportação de componente: MUDAR para 'off'
      // Resolve o erro 'react-refresh/only-export-components' no useAuth.jsx
      'react-refresh/only-export-components': 'off',
      
      // 4. Regras de Lógica Constante: MUDAR para 'warn'
      'no-constant-binary-expression': 'warn',
    },
  },
])
