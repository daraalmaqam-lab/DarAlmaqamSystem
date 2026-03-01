const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد قاعدة البيانات
const db = new sqlite3.Database('./database.db');

// إنشاء الجداول لو مش موجودة
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    branch TEXT,
    username TEXT,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pilgrimName TEXT,
    invoicePath TEXT,
    passportPath TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    airline TEXT,
    fromCity TEXT,
    toCity TEXT,
    flightGo TEXT,
    flightReturn TEXT,
    departTime TEXT,
    arriveTime TEXT,
    economySeats INTEGER,
    businessSeats INTEGER,
    price TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotelName TEXT,
    city TEXT,
    roomType TEXT,
    nights INTEGER,
    price TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pilgrims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    hotelMedina TEXT,
    hotelMecca TEXT,
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

// مجلد عام
app.use(express.static(path.join(__dirname, 'public')));

// ✅ عرض البيانات من كل جدول
app.get('/users', (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) return res.status(500).send("خطأ في جلب المستخدمين");
    res.json(rows);
  });
});

app.get('/invoices', (req, res) => {
  db.all(`SELECT * FROM invoices`, [], (err, rows) => {
    if (err) return res.status(500).send("خطأ في جلب الفواتير");
    res.json(rows);
  });
});

app.get('/flights', (req, res) => {
  db.all(`SELECT * FROM flights`, [], (err, rows) => {
    if (err) return res.status(500).send("خطأ في جلب الرحلات");
    res.json(rows);
  });
});

app.get('/hotels', (req, res) => {
  db.all(`SELECT * FROM hotels`, [], (err, rows) => {
    if (err) return res.status(500).send("خطأ في جلب الفنادق");
    res.json(rows);
  });
});

app.get('/pilgrims', (req, res) => {
  db.all(`SELECT * FROM pilgrims`, [], (err, rows) => {
    if (err) return res.status(500).send("خطأ في جلب المعتمرين");
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
