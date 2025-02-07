#!/usr/bin/env node

import fs from "fs";
import path from "path";

const promptTemplate = (
  structure,
  cssFrameworks,
  stateManagement,
  fileTypes,
  cssImports,
  themes
) => `name: gencode
description: Generate Next.js code structure with best practices.
---
### User Input:
{{{ input }}}

### Project Details:
- **Language:** ${fileTypes.includes("ts") ? "TypeScript" : "JavaScript"}
- **Framework:** Next.js
- **CSS Frameworks:** ${
  Object.keys(cssFrameworks)
    .filter((k) => cssFrameworks[k])
    .join(", ") || "None detected"
}
- **State Management:** ${
  Object.keys(stateManagement)
    .filter((k) => stateManagement[k])
    .join(", ") || "None detected"
}
- **Detected Themes:** ${
  themes.join(", ") || "No specific theme configuration found"
}

### CSS Import Guidelines:
${cssImports.join("\n")}

### Project Structure:
\`\`\`
${JSON.stringify(structure, null, 2)}
\`\`\`

### Instructions:
1. Analyze the Next.js project structure and generate a structured prompt.
2. Use **${
  Object.keys(cssFrameworks)
    .filter((k) => cssFrameworks[k])
    .join(", ") || "No specific CSS framework"
}** for styling guidance.
3. Identify state management methods such as **${
  Object.keys(stateManagement)
    .filter((k) => stateManagement[k])
    .join(", ") || "Context API or no state management"
}** if applicable.
4. Provide insights for maintaining a **modular, scalable, and maintainable** Next.js application.
5. Ensure recommendations for **accessibility** and **performance optimization**.

### Output:
Return only the structured Next.js code as files, no additional explanations.
`;

const getFilesRecursively = (
  dir,
  ignoredPaths = [
    "node_modules",
    ".git",
    ".next",
    "dist",
    "coverage",
    ".vscode",
  ]
) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    if (
      ignoredPaths.some((ignored) => filePath.includes(ignored)) ||
      file.startsWith(".")
    ) {
      return;
    }
    const stat = fs.statSync(filePath);
    if (stat?.isDirectory()) {
      results = [...results, ...getFilesRecursively(filePath, ignoredPaths)];
    } else {
      results.push(filePath);
    }
  });
  return results;
};

const scanProjectStructure = (projectPath) => {
  console.log("🔍 Scanning Project Structure...");
  const files = getFilesRecursively(projectPath);
  const fileTypes = [
    ...new Set(files.map((f) => (f.endsWith(".ts") ? "ts" : "js"))),
  ];

  return {
    fileTypes,
    pages: files
      .filter((f) => f.includes("/pages/"))
      .map((f) => f.replace(projectPath, "")),
    components: files
      .filter((f) => f.includes("/components/"))
      .map((f) => f.replace(projectPath, "")),
    apiRoutes: files
      .filter((f) => f.includes("/pages/api/"))
      .map((f) => f.replace(projectPath, "")),
    styles: files
      .filter((f) => f.includes("/styles/"))
      .map((f) => f.replace(projectPath, "")),
  };
};

const detectThemes = (projectPath) => {
  const themeFiles = [
    "theme.ts",
    "theme.js",
    "tailwind.config.js",
    "tailwind.config.ts",
    "styled-components.ts",
    "styled-components.js",
    "chakra-ui-theme.ts",
    "chakra-ui-theme.js",
    "antd-theme.ts",
    "antd-theme.js",
  ];

  return themeFiles.filter((file) =>
    fs.existsSync(path.join(projectPath, file))
  );
};

const detectCSSImports = (cssFrameworks) => {
  const imports = [];
  if (cssFrameworks.tailwind)
    imports.push("import 'tailwindcss/tailwind.css';");
  if (cssFrameworks.styledComponents)
    imports.push("import styled from 'styled-components';");
  if (cssFrameworks.chakraUI)
    imports.push("import { ChakraProvider } from '@chakra-ui/react';");
  if (cssFrameworks.bootstrap)
    imports.push("import 'bootstrap/dist/css/bootstrap.min.css';");
  if (cssFrameworks.mui)
    imports.push("import { ThemeProvider } from '@mui/material/styles';");
  if (cssFrameworks.daisyUI)
    imports.push("import { xxx } from 'react-daisyui';");
  return imports;
};

const detectCSSFramework = (projectPath) => {
  const packageJsonPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return {};
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const dependencies = Object.keys(packageJson.dependencies || {});

  return {
    tailwind: dependencies.includes("tailwindcss"),
    styledComponents: dependencies.includes("styled-components"),
    chakraUI: dependencies.includes("@chakra-ui/react"),
    bootstrap: dependencies.includes("bootstrap"),
    mui: dependencies.includes("@mui/material"),
    daisyUI:
      dependencies.includes("daisyui") ||
      dependencies.includes("react-daisyui"),
  };
};

const scanNextProject = (projectPath) => {
  const structure = scanProjectStructure(projectPath);
  const cssFrameworks = detectCSSFramework(projectPath);
  const stateManagement = {};
  const cssImports = detectCSSImports(cssFrameworks);
  const themes = detectThemes(projectPath);

  const outputPath = path.join(projectPath, ".continue/prompts/gencode.prompt");
  const outputData = promptTemplate(
    structure,
    cssFrameworks,
    stateManagement,
    structure.fileTypes,
    cssImports,
    themes
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, outputData);
  console.log("\n📁 Prompt saved to:", outputPath);
};

const projectPath = process.argv[2] || process.cwd();
scanNextProject(projectPath);
