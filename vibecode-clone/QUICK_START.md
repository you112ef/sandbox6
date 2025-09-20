# 🚀 Vibecode Clone - Quick Start Guide

## الطريقة الأسرع للتشغيل (5 دقائق)

### الخطوة 1: تحضير المشروع

```bash
# انتقل إلى مجلد المشروع
cd vibecode-clone

# تثبيت المتطلبات الأساسية فقط
npm install express
```

### الخطوة 2: تشغيل الخادم التجريبي

```bash
# تشغيل الخادم التجريبي
node run-demo.js
```

أو باستخدام npm:

```bash
npm run demo
```

### الخطوة 3: الوصول إلى المنصة

🌐 **افتح المتصفح واذهب إلى:** http://localhost:3000

## 🔐 حسابات تجريبية جاهزة

```
المستخدم التجريبي:
البريد: demo@vibecode.dev
كلمة المرور: demo123

المدير:
البريد: admin@vibecode.dev  
كلمة المرور: admin123
```

## 📡 نقاط النهاية المتاحة

| الطريقة | المسار | الوصف |
|---------|--------|--------|
| GET | `/` | الصفحة الرئيسية |
| POST | `/api/auth/login` | تسجيل الدخول |
| GET | `/api/workspaces` | قائمة مساحات العمل |
| GET | `/api/templates` | قوالب المشاريع |
| GET | `/api/health` | فحص حالة الخادم |
| POST | `/api/ai/execute` | تجربة الذكاء الاصطناعي |

## 🧪 اختبار المميزات

### 1. تسجيل الدخول

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@vibecode.dev", "password": "demo123"}'
```

### 2. عرض مساحات العمل

```bash
curl http://localhost:3000/api/workspaces
```

### 3. عرض القوالب

```bash
curl http://localhost:3000/api/templates
```

### 4. فحص حالة الخادم

```bash
curl http://localhost:3000/api/health
```

### 5. تجربة الذكاء الاصطناعي

```bash
curl -X POST http://localhost:3000/api/ai/execute \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a React component"}'
```

## ✨ المميزات المتاحة في النسخة التجريبية

- ✅ **واجهة المستخدم**: صفحة رئيسية تفاعلية
- ✅ **المصادقة**: تسجيل دخول بحسابات تجريبية
- ✅ **API كامل**: جميع نقاط النهاية تعمل
- ✅ **مساحات العمل**: عرض وإدارة المشاريع
- ✅ **القوالب**: مكتبة قوالب جاهزة
- ✅ **الذكاء الاصطناعي**: محاكاة استجابات الذكاء الاصطناعي
- ✅ **مراقبة النظام**: فحص حالة الخادم

## 🔧 التطوير المتقدم

إذا كنت تريد تشغيل النظام الكامل مع جميع الخدمات:

```bash
# تثبيت جميع التبعيات
npm install

# تشغيل جميع الخدمات
node start.js
```

هذا سيبدأ:
- الواجهة الأمامية: http://localhost:3000
- API الخلفي: http://localhost:8000
- مدير الذكاء الاصطناعي: http://localhost:8001

## 🐳 التشغيل باستخدام Docker

```bash
# بناء وتشغيل جميع الحاويات
docker-compose -f docker/docker-compose.yml up --build
```

## 🛑 إيقاف الخادم

اضغط `Ctrl+C` في الطرفية لإيقاف الخادم.

## 📋 استكشاف الأخطاء

### الخطأ: "Cannot find module 'express'"

```bash
npm install express
```

### الخطأ: "Port 3000 is already in use"

```bash
# تغيير المنفذ في ملف run-demo.js
# أو إيقاف الخدمة الأخرى التي تستخدم المنفذ 3000
```

### الخطأ: "Permission denied"

```bash
chmod +x run-demo.js
```

## 🎯 الخطوات التالية

بعد تشغيل النسخة التجريبية بنجاح، يمكنك:

1. **استكشاف الكود**: تصفح ملفات المشروع في المجلدات المختلفة
2. **تخصيص المميزات**: تعديل الملفات لإضافة مميزات جديدة
3. **التطوير الكامل**: إعداد قاعدة البيانات والخدمات الكاملة
4. **النشر**: رفع المشروع على خادم إنتاج

---

**🎉 مبروك! لديك الآن منصة Vibecode Clone تعمل بالكامل!**