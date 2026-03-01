const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer'); // لرفع الملفات

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// إعداد رفع الملفات (صور الجوازات والفواتير)
const upload = multer({ dest: 'uploads/' });

// مجلد عام للملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

// مثال: استقبال بيانات مستخدم جديد
app.post('/addUser', (req, res) => {
  const { branch, username, password } = req.body;
  // هنا تخزن البيانات في قاعدة البيانات
  console.log(`فرع: ${branch}, مستخدم: ${username}, كلمة مرور: ${password}`);
  res.send('تم إضافة المستخدم بنجاح');
});

// مثال: استقبال فاتورة وصورة جواز
app.post('/uploadData', upload.fields([{ name: 'invoice' }, { name: 'passport' }]), (req, res) => {
  const { pilgrimName } = req.body;
  console.log(`معتمر: ${pilgrimName}`);
  console.log(req.files); // فيه مسار الملفات المرفوعة
  res.send('تم رفع البيانات بنجاح');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
