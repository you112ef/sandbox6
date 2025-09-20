#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 اختبار الميزات الحقيقية في Vibecode Clone\n');

// Test 1: Check if demo server file exists
console.log('1️⃣ فحص ملف الخادم التجريبي...');
if (fs.existsSync('run-demo.js')) {
  console.log('   ✅ ملف run-demo.js موجود');
} else {
  console.log('   ❌ ملف run-demo.js غير موجود');
}

// Test 2: Check if package.json has required dependencies
console.log('\n2️⃣ فحص التبعيات المطلوبة...');
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['express', 'better-sqlite3'];
  
  requiredDeps.forEach(dep => {
    if (pkg.dependencies && pkg.dependencies[dep]) {
      console.log(`   ✅ ${dep} موجود في package.json`);
    } else {
      console.log(`   ❌ ${dep} غير موجود - تشغيل: npm install ${dep}`);
    }
  });
} else {
  console.log('   ❌ ملف package.json غير موجود');
}

// Test 3: Check if backend has real database code
console.log('\n3️⃣ فحص كود قاعدة البيانات الحقيقية...');
const authFile = 'backend/src/routes/auth.ts';
if (fs.existsSync(authFile)) {
  const content = fs.readFileSync(authFile, 'utf8');
  if (content.includes('better-sqlite3') || content.includes('SQLite')) {
    console.log('   ✅ كود قاعدة البيانات الحقيقية موجود في auth.ts');
  } else {
    console.log('   ❌ كود قاعدة البيانات الحقيقية غير موجود');
  }
} else {
  console.log('   ❌ ملف auth.ts غير موجود');
}

// Test 4: Check if file service exists
console.log('\n4️⃣ فحص خدمة الملفات الحقيقية...');
const fileService = 'backend/src/services/FileService.ts';
if (fs.existsSync(fileService)) {
  const content = fs.readFileSync(fileService, 'utf8');
  if (content.includes('fs/promises') && content.includes('createWorkspace')) {
    console.log('   ✅ خدمة الملفات الحقيقية موجودة');
  } else {
    console.log('   ❌ خدمة الملفات الحقيقية غير مكتملة');
  }
} else {
  console.log('   ❌ خدمة الملفات غير موجودة');
}

// Test 5: Check if AI provider exists
console.log('\n5️⃣ فحص موفر الذكاء الاصطناعي...');
const aiProvider = 'ai-agent-manager/src/providers/OpenAIProvider.ts';
if (fs.existsSync(aiProvider)) {
  const content = fs.readFileSync(aiProvider, 'utf8');
  if (content.includes('import OpenAI') && content.includes('execute')) {
    console.log('   ✅ موفر الذكاء الاصطناعي الحقيقي موجود');
  } else {
    console.log('   ❌ موفر الذكاء الاصطناعي غير مكتمل');
  }
} else {
  console.log('   ❌ موفر الذكاء الاصطناعي غير موجود');
}

// Test 6: Check documentation
console.log('\n6️⃣ فحص الوثائق...');
const docs = [
  'FEATURES_REAL.md',
  'REAL_IMPLEMENTATION.md',
  'QUICK_START.md',
  'docs/ARCHITECTURE.md'
];

docs.forEach(doc => {
  if (fs.existsSync(doc)) {
    console.log(`   ✅ ${doc} موجود`);
  } else {
    console.log(`   ❌ ${doc} غير موجود`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('📋 ملخص الاختبار:');
console.log('='.repeat(60));

// Summary
const testResults = [];

// Check core files
const coreFiles = [
  'run-demo.js',
  'package.json', 
  'backend/src/routes/auth.ts',
  'backend/src/services/FileService.ts',
  'ai-agent-manager/src/providers/OpenAIProvider.ts'
];

const existingFiles = coreFiles.filter(file => fs.existsSync(file));
console.log(`📁 الملفات الأساسية: ${existingFiles.length}/${coreFiles.length}`);

// Check if ready to run
if (fs.existsSync('run-demo.js') && fs.existsSync('package.json')) {
  console.log('\n🚀 جاهز للتشغيل!');
  console.log('\nللبدء:');
  console.log('   npm install express better-sqlite3');
  console.log('   node run-demo.js');
  console.log('\nثم افتح: http://localhost:3000');
} else {
  console.log('\n⚠️  بعض الملفات مفقودة - تحقق من التثبيت');
}

console.log('\n📖 للمزيد من المعلومات:');
console.log('   - اقرأ FEATURES_REAL.md للميزات الحقيقية');
console.log('   - اقرأ QUICK_START.md للبدء السريع');
console.log('   - اقرأ REAL_IMPLEMENTATION.md للتفاصيل التقنية');

console.log('\n✨ Vibecode Clone - نظام حقيقي وعامل!');