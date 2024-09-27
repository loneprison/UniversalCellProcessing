// 用于更新custom文件夹的index.ts
// node AuxiliaryTestScript\generateIndex.js

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../utilsLibrary');
const files = fs.readdirSync(dir);
const exportStatements = files
    .filter(file => file.endsWith('.tsx'))
    .map(file => `export { default as ${file.replace('.tsx', '')} } from './${file.replace('.tsx', '')}';`)
    .join('\n');

// 生成或更新 index.ts 文件
fs.writeFileSync(path.join(dir, 'utilsLibrary.ts'), exportStatements);

