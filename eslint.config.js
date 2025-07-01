import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Default ESLint recommended rules
  js.configs.recommended,

  // Next.js core configurations
  ...compat.extends('next/core-web-vitals'),

  // You can add other configurations here
  // For example, to add Prettier
  // ...compat.extends("prettier"),

  // Custom rules can be added here
  {
    rules: {
      'no-unused-vars': 'warn',
    },
  },
  {
    ignores: ['.next/', 'node_modules/', 'public/'],
  },
];
