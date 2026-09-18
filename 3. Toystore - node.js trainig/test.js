const fs = require('fs');
const path = require('path');

console.log('=== ДИАГНОСТИКА СТРУКТУРЫ ===\n');

// 1. Где мы находимся?
console.log('📂 Текущая папка:', process.cwd());

// 2. Что есть в корне?
console.log('\n📁 Содержимое корневой папки:');
const rootFiles = fs.readdirSync('./');
rootFiles.forEach(file => {
    const fullPath = path.join('./', file);
    const isDir = fs.statSync(fullPath).isDirectory();
    console.log(`   ${isDir ? '📁' : '📄'} ${file}`);
});

// 3. Проверяем src
console.log('\n📁 Проверка папки src:');
if (fs.existsSync('src')) {
    console.log('   ✅ Папка src существует');
    
    const srcFiles = fs.readdirSync('src');
    console.log('   Содержимое src:');
    srcFiles.forEach(file => {
        const fullPath = path.join('src', file);
        const isDir = fs.statSync(fullPath).isDirectory();
        console.log(`      ${isDir ? '📁' : '📄'} ${file}`);
    });
} else {
    console.log('   ❌ Папка src НЕ существует!');
}

// 4. Проверяем src/routes
console.log('\n📁 Проверка папки src/routes:');
if (fs.existsSync('src/routes')) {
    console.log('   ✅ Папка src/routes существует');
    
    const routeFiles = fs.readdirSync('src/routes');
    console.log('   Содержимое src/routes:');
    routeFiles.forEach(file => {
        console.log(`      📄 ${file}`);
    });
} else {
    console.log('   ❌ Папка src/routes НЕ существует!');
}

// 5. Проверяем src/controllers
console.log('\n📁 Проверка папки src/controllers:');
if (fs.existsSync('src/controllers')) {
    console.log('   ✅ Папка src/controllers существует');
    
    const controllerFiles = fs.readdirSync('src/controllers');
    console.log('   Содержимое src/controllers:');
    controllerFiles.forEach(file => {
        console.log(`      📄 ${file}`);
    });
} else {
    console.log('   ❌ Папка src/controllers НЕ существует!');
}

// 6. Проверяем файлы
console.log('\n📄 Проверка файлов:');
const filesToCheck = [
    'src/routes/product.routes.js',
    'src/controllers/product.controller.js'
];

filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        console.log(`   ✅ ${file} (${stats.size} байт)`);
    } else {
        console.log(`   ❌ ${file} НЕ существует!`);
    }
});

console.log('\n=== ДИАГНОСТИКА ЗАВЕРШЕНА ===');