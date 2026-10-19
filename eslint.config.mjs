// Lint rápido (sem informação de tipos). As regras que precisam do TypeScript
// ficam em eslint.typed.config.mjs (`npm run lint:typed`).
// Adaptado do Vibe Coding Toolkit (templates/eslint, revisão 790a895) para
// Vite + React + Supabase. Regras com dívida antiga começam em "warn" com
// contagem em docs/quality.md; promova para "error" quando zerar.
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import importX from "eslint-plugin-import-x";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

import quality from "./eslint-rules/index.cjs";

const testFiles = ["**/*.test.{js,mjs,ts,tsx}", "tests/**/*.{js,mjs,ts,tsx}"];

export default defineConfig([
  {
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
      globals: { ...globals.browser },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  reactPlugin.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  { settings: { react: { version: "detect" } } },

  {
    // Fronteira de arquitetura: o site público não importa nada do painel
    // (o painel é um pacote separado, carregado só em /admin).
    plugins: { "import-x": importX },
    settings: { "import-x/resolver-next": [createTypeScriptImportResolver()] },
    rules: {
      "import-x/no-unresolved": "error",
      "import-x/no-duplicates": "error",
      "import-x/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: ["./src/pages/**/*", "./src/components/**/*", "./src/lib/**/*"],
              from: "./src/admin/**/*",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { quality },
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-var": "error",
      "prefer-const": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      complexity: ["warn", 12],
      "max-depth": ["warn", 4],
      "max-statements": ["warn", 20],
      "max-params": ["warn", 4],
      "max-lines-per-function": ["warn", { max: 150, skipBlankLines: true, skipComments: true }],
      "max-nested-callbacks": ["warn", 3],
      // 350 linhas é a referência do kit; 3 arquivos antigos passam disso (docs/quality.md).
      "quality/max-lines": "warn",
      // Dívida medida em 19/10/2026 (docs/quality.md): o painel usa `supabase!` porque só roda
      // com o Supabase configurado, e alguns efeitos chamam setState ao carregar dados.
      "@typescript-eslint/no-non-null-assertion": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "quality/no-direct-console": ["warn", { logger: "console.warn só em falhas de carregamento" }],
      // Componentes visuais não falam direto com o banco: usam src/lib/dados.ts.
      "quality/no-direct-data-access": [
        "error",
        { modules: ["../lib/supabase", "@/lib/supabase"], layers: ["src/components/"], bindings: ["supabase"] },
      ],
    },
  },
  {
    files: testFiles,
    languageOptions: { globals: { ...globals.node } },
    rules: { "max-statements": "off", "max-lines-per-function": "off", "max-nested-callbacks": "off" },
  },
  {
    files: ["scripts/**/*.mjs", "*.config.{js,mjs,ts}", "vite.config.ts"],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ["eslint-rules/**/*.cjs"],
    languageOptions: { sourceType: "commonjs", globals: { ...globals.node } },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  globalIgnores([
    ".claude/**",
    "node_modules/**",
    "dist/**",
    "**/*.tsbuildinfo",
    "package-lock.json",
    // Código Deno (função do Supabase): outro runtime, checado à parte.
    "supabase/functions/**",
  ]),
]);
