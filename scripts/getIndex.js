/*
    npm run getIndex
    更新utilsLibrary.ts
*/
const fs = require('fs');
const path = require('path');

// 定义 utilsLibrary 目录路径，基于运行脚本的当前目录
const dir = path.join(process.cwd(), './utilsLibrary');

// 检查目标目录是否存在
if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    process.exit(1);
}

// 获取目录下的所有文件
const files = fs.readdirSync(dir);

// 筛选 .tsx 文件并生成 export 语句
const tsxFiles = files.filter(file => file.endsWith('.tsx'));

const exportStatements = tsxFiles
    .map(file => {
        const exportName = file.replace('.tsx', '');
        console.log(`add export：${exportName}`);
        return `export { default as ${exportName} } from './${exportName}';`;
    })
    .join('\n');

// 输出到目标文件
const outputPath = path.join(dir, 'utilsLibrary.ts');
fs.writeFileSync(outputPath, exportStatements);
