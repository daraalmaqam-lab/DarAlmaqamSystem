const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const PORT = 3000;

// تخزين الملفات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// مستخدمين تجريبيين
const users = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "branch1", password: "1234", role: "branch" },
];

let requests = [];

// تسجيل دخول
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.json({ success: false });
  }

  res.json({ success: true, role: user.role });
});

// رفع طلب من الفرع
app.post(
  "/upload",
  upload.fields([
    { name: "passport", maxCount: 1 },
    { name: "invoice", maxCount: 1 },
  ]),
  (req, res) => {
    const data = {
      id: Date.now(),
      name: req.body.name,
      passport: req.files["passport"][0].filename,
      invoice: req.files["invoice"][0].filename,

      // الحقول الجديدة
      city: req.body.city,
      hotel: req.body.hotel,
      nights_city: req.body.nights_city,
      nights_mecca: req.body.nights_mecca,
      room_type: req.body.room_type,
      price: req.body.price,
    };

    requests.push(data);
    res.json({ success: true });
  }
);

// عرض الطلبات للمدير
app.get("/requests", (req, res) => {
  res.json(requests);
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
