# 🎨 VS Code Setup Guide

Complete guide for setting up Visual Studio Code for FC Manager Pro development.

## 📦 Required Extensions

Install these extensions to ensure optimal development experience:

### Essential Extensions

1. **ES7+ React/Redux/React-Native snippets**
   - ID: `dsznajder.es7-react-js-snippets`
   - Install: Press `Ctrl+P` (or `Cmd+P` on Mac), paste:
   ```
   ext install dsznajder.es7-react-js-snippets
   ```
   - Purpose: React code snippets and shortcuts

2. **ESLint**
   - ID: `dbaeumer.vscode-eslint`
   - Install command:
   ```
   ext install dbaeumer.vscode-eslint
   ```
   - Purpose: JavaScript/TypeScript linting

3. **Prettier - Code formatter**
   - ID: `esbenp.prettier-vscode`
   - Install command:
   ```
   ext install esbenp.prettier-vscode
   ```
   - Purpose: Automatic code formatting

4. **Tailwind CSS IntelliSense**
   - ID: `bradlc.vscode-tailwindcss`
   - Install command:
   ```
   ext install bradlc.vscode-tailwindcss
   ```
   - Purpose: Tailwind CSS autocomplete and syntax highlighting

5. **TypeScript Vue Plugin (Volar)**
   - ID: `Vue.vscode-typescript-vue-plugin`
   - Install command:
   ```
   ext install Vue.vscode-typescript-vue-plugin
   ```
   - Purpose: Better TypeScript support

6. **Path Intellisense**
   - ID: `christian-kohler.path-intellisense`
   - Install command:
   ```
   ext install christian-kohler.path-intellisense
   ```
   - Purpose: Autocomplete for file paths

7. **Auto Rename Tag**
   - ID: `formulahendry.auto-rename-tag`
   - Install command:
   ```
   ext install formulahendry.auto-rename-tag
   ```
   - Purpose: Automatically rename paired HTML/JSX tags

8. **GitLens**
   - ID: `eamodio.gitlens`
   - Install command:
   ```
   ext install eamodio.gitlens
   ```
   - Purpose: Enhanced Git capabilities

### Recommended Extensions

9. **Error Lens**
   - ID: `usernamehw.errorlens`
   - Install command:
   ```
   ext install usernamehw.errorlens
   ```
   - Purpose: Inline error display

10. **Import Cost**
    - ID: `wix.vscode-import-cost`
    - Install command:
    ```
    ext install wix.vscode-import-cost
    ```
    - Purpose: Display import package size

11. **Better Comments**
    - ID: `aaron-bond.better-comments`
    - Install command:
    ```
    ext install aaron-bond.better-comments
    ```
    - Purpose: Colorful comment highlighting

12. **Color Highlight**
    - ID: `naumovs.color-highlight`
    - Install command:
    ```
    ext install naumovs.color-highlight
    ```
    - Purpose: Highlight color codes in CSS/Tailwind

13. **Thunder Client** (Optional - API Testing)
    - ID: `rangav.vscode-thunder-client`
    - Install command:
    ```
    ext install rangav.vscode-thunder-client
    ```
    - Purpose: Test Supabase API endpoints

## ⚙️ VS Code Settings Configuration

Create or update `.vscode/settings.json` in your project root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "emmet.triggerExpansionOnTab": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 📋 VS Code Extensions Configuration File

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dsznajder.es7-react-js-snippets",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "Vue.vscode-typescript-vue-plugin",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "eamodio.gitlens",
    "usernamehw.errorlens",
    "wix.vscode-import-cost",
    "aaron-bond.better-comments",
    "naumovs.color-highlight",
    "rangav.vscode-thunder-client"
  ]
}
```

When you open the project, VS Code will suggest installing these extensions automatically.

## 🚀 Manual Installation Steps

### Step 1: Open Extensions Panel
Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)

### Step 2: Install All Extensions

**Option A: One by one**
1. Search for each extension by name
2. Click "Install"
3. Reload VS Code if prompted

**Option B: Using Command Palette (Faster)**
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P`)
2. Type "Extensions: Install Extensions"
3. Paste each extension ID and install

**Option C: Using Terminal (Fastest)**

Run this command from your project root:

```bash
# For Windows/Linux
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension Vue.vscode-typescript-vue-plugin
code --install-extension christian-kohler.path-intellisense
code --install-extension formulahendry.auto-rename-tag
code --install-extension eamodio.gitlens
code --install-extension usernamehw.errorlens
code --install-extension wix.vscode-import-cost
code --install-extension aaron-bond.better-comments
code --install-extension naumovs.color-highlight
code --install-extension rangav.vscode-thunder-client

# For Mac, use the same commands
```

### Step 3: Reload VS Code
After installing all extensions, reload VS Code:
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P`)
- Type "Reload Window"
- Press Enter

## 🎯 Keyboard Shortcuts (Useful for Development)

### React Snippets (after installing ES7+ extension)

- `rafce` → React Arrow Function Component Export
- `useState` → Import and use useState hook
- `useEffect` → Import and use useEffect hook
- `imrc` → Import React Component

### General VS Code Shortcuts

- `Ctrl+P` (Cmd+P) → Quick file search
- `Ctrl+Shift+F` (Cmd+Shift+F) → Search in all files
- `Ctrl+D` (Cmd+D) → Multi-cursor (select next occurrence)
- `Alt+Up/Down` (Option+Up/Down) → Move line up/down
- `Shift+Alt+Down` (Shift+Option+Down) → Copy line down
- `Ctrl+/` (Cmd+/) → Toggle comment
- `Ctrl+Shift+L` (Cmd+Shift+L) → Select all occurrences
- `F2` → Rename symbol (works for variables, functions, etc.)

### Formatting

- `Shift+Alt+F` (Shift+Option+F) → Format document
- `Ctrl+K Ctrl+F` (Cmd+K Cmd+F) → Format selection

## 🔧 Prettier Configuration

Create `.prettierrc` in project root:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Create `.prettierignore`:

```
# Dependencies
node_modules
.pnp
.pnp.js

# Build output
dist
build
.next
out

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Misc
.DS_Store
*.log
coverage
.vscode
```

## 🛠️ ESLint Configuration

Your project should have `.eslintrc.cjs` or `.eslintrc.json`. If not, create one:

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

## ✅ Verification

After setup, verify everything works:

1. **Open a `.tsx` file**
   - Tailwind autocomplete should work
   - TypeScript errors should show inline (Error Lens)
   - Prettier should format on save

2. **Test Snippets**
   - Type `rafce` and press Tab
   - Should create a React component

3. **Check Formatting**
   - Make code messy
   - Press `Shift+Alt+F` (or `Shift+Option+F`)
   - Should auto-format

## 🎨 Theme Recommendations (Optional)

Popular themes for React development:

1. **One Dark Pro** (`zhuangtongfa.Material-theme`)
2. **Night Owl** (`sdras.night-owl`)
3. **Tokyo Night** (`enkia.tokyo-night`)
4. **GitHub Theme** (`GitHub.github-vscode-theme`)

Install any theme:
```bash
code --install-extension zhuangtongfa.Material-theme
```

## 🚨 Troubleshooting

### Issue: ESLint not working
- Solution: Run `npm install` to ensure all dependencies are installed
- Check `.eslintrc.cjs` exists
- Reload VS Code window

### Issue: Prettier not formatting on save
- Solution: Check `settings.json` has `"editor.formatOnSave": true`
- Ensure Prettier is set as default formatter
- Restart VS Code

### Issue: Tailwind autocomplete not working
- Solution: Ensure `tailwind.config.js` exists
- Check Tailwind CSS IntelliSense extension is installed
- Reload VS Code

### Issue: TypeScript errors everywhere
- Solution: Run `npm install`
- Check `tsconfig.json` exists
- Run `npm run type-check`

## 🎯 You're Ready!

Once all extensions are installed and configured:
1. Reload VS Code
2. Open a `.tsx` file
3. Start coding with full autocomplete, linting, and formatting support!

Head to [docs/phases/PHASE_1.md](phases/PHASE_1.md) to begin development.
