import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [
      'dist/**', 
      'node_modules/**', 
      'build/**',
      '*.config.js', 
      '*.config.ts', 
      '.eslintrc.js',
      'cdn-config/**',
      'scripts/**',
      '**/*.cjs',
      'public/**',
      'docs/**',
      'vercel-deployment-ultimate-fix.js',
      'build-test.cjs',
      'vite.config.ts',
      'vitest.config.ts',
      'tailwind.config.js',
      'postcss.config.js'
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        global: 'readonly',
        self: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        HTMLElement: 'readonly',
        MouseEvent: 'readonly',
        TouchEvent: 'readonly',
        Event: 'readonly',
        Node: 'readonly',
        IntersectionObserver: 'readonly',
        CustomEvent: 'readonly',
        navigator: 'readonly',
        performance: 'readonly',
        queueMicrotask: 'readonly',
        AbortController: 'readonly',
        ResizeObserver: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __REACT_DEVTOOLS_GLOBAL_HOOK__: 'readonly',
        reportError: 'readonly',
        // Add missing globals
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        NodeJS: 'readonly',
        Element: 'readonly',
        KeyboardEvent: 'readonly',
        HTMLParagraphElement: 'readonly',
        HTMLHeadingElement: 'readonly',
        HTMLOListElement: 'readonly',
        HTMLLIElement: 'readonly',
        HTMLAnchorElement: 'readonly',
        HTMLSpanElement: 'readonly',
        HTMLTableElement: 'readonly',
        HTMLTableSectionElement: 'readonly',
        HTMLTableRowElement: 'readonly',
        HTMLTableCellElement: 'readonly',
        HTMLTableCaptionElement: 'readonly',
        IntersectionObserverEntry: 'readonly',
        Storage: 'readonly',
        prompt: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react: react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      
      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'warn',
      'react/no-unused-prop-types': 'warn',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn', // Temporarily allow any types
      '@typescript-eslint/no-empty-object-type': 'warn', // Temporarily allow empty interfaces
      'prefer-const': 'error',
      '@typescript-eslint/no-var-requires': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // General JavaScript rules
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-unused-vars': 'off', // Handled by TypeScript
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'multi-line'],
      'no-undef': 'warn', // Temporarily reduce severity
      'no-useless-escape': 'warn', // Temporarily reduce severity
      'no-constant-binary-expression': 'warn', // Temporarily reduce severity
      'no-redeclare': 'warn', // Temporarily reduce severity
      'react/no-unknown-property': 'warn', // Temporarily reduce severity
      
      // Import/export rules
      'no-duplicate-imports': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]; 