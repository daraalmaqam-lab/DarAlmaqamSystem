const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// قاعدة بيانات SQLite
const db = new sqlite3.Database('./database.db');

// إنشاء جدول واحد للفروع
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS branches_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    branch TEXT,
    username TEXT,
    password TEXT,
    pilgrimName TEXT,
    invoicePath TEXT,
    passportPath TEXT,
    airline TEXT,
    fromCity TEXT,
    toCity TEXT,
    flightGo TEXT,
    flightReturn TEXT,
    departTime TEXT,
    arriveTime TEXT,
    economySeats INTEGER,
    businessSeats INTEGER,
    price TEXT,
    hotelName TEXT,
    city TEXT,
    roomType TEXT,
    nights INTEGER,
    hotelPrice TEXT,
    pilgrimHotelMedina TEXT,
    pilgrimHotelMecca TEXT,
    repMedina TEXT,
    repMecca TEXT,
    companyPhone TEXT
  )`);
});

// إعداد bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// إعداد رفع الملفات
const upload = multer({ dest: 'uploads/' });

// مجلد عام للصفحات
app.use(express.static(path.join(__dirname, 'public')));

// ✅ إضافة بيانات من الفروع
app.post('/branches', upload.fields([{ name: 'invoice' }, { name: 'passport' }]), (req, res) => {
  const data = req.body;
  const invoicePath = req.files['invoice'] ? req.files['invoice'][0].path : null;
  const passportPath = req.files['passport'] ? req.files['passport'][0].path : null;

  db.run(`INSERT INTO branches_data (
    branch, username, password, pilgrimName, invoicePath, passportPath,
    airline, fromCity, toCity, flightGo, flightReturn, departTime, arriveTime,
    economySeats, businessSeats, price, hotelName, city, roomType, nights, hotelPrice,
    pilgrimHotelMedina, pilgrimHotelMecca, repMedina, repMecca, companyPhone
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.branch, data.username, data.password, data.pilgrimName, invoicePath, passportPath,
      data.airline, data.fromCity, data.toCity, data.flightGo, data.flightReturn, data.departTime, data.arriveTime,
      data.economySeats, data.businessSeats, data.price, data.hotelName, data.city, data.roomType, data.nights, data.hotelPrice,
      data.pilgrimHotelMedina, data.pilgrimHotelMecca, data.repMedina, data.repMecca, data.companyPhone
    ],
    function(err) {
      if (err) return res.status(500).send("خطأ في إضافة بيانات الفرع");
      res.send("تم تخزين بيانات الفرع بنجاح");
    });
});

// ✅ عرض كل بيانات الفروع
app.get('/branches', (req, res) => {
  db.all(`SELECT * FROM branches_data`, [], (err, rows) => {
    if (err) return res.status(500).send("خطأ في جلب بيانات الفروع");
    res.json(rows);
  });
});

// ✅ مسح بيانات فرع معين
app.delete('/branches/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM branches_data WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).send("خطأ في مسح بيانات الفرع");
    res.send("تم مسح بيانات الفرع بنجاح");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
