const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// إعداد مجلد عام للملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

// إعداد رفع الملفات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// صفحة رئيسية
app.get('/', (req, res) => {
  res.send('مرحباً بك في نظام دار المقام');
});

// مثال API لإضافة حاج/معتمر
app.post('/pilgrims', (req, res) => {
  const { name, passport } = req.body;
  res.json({ message: 'تم تسجيل الحاج بنجاح', data: { name, passport } });
});

// مثال API لرفع ملف
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'تم رفع الملف بنجاح', file: req.file });
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
