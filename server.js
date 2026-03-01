// إضافة مستخدم جديد
app.post('/addUser', (req, res) => {
  const { branch, username, password } = req.body;
  db.run(`INSERT INTO users (branch, username, password) VALUES (?, ?, ?)`,
    [branch, username, password],
    function(err) {
      if (err) return res.status(500).send("خطأ في إضافة المستخدم");
      res.send("تم إضافة المستخدم بنجاح");
    });
});

// عرض قائمة المستخدمين
app.get('/users', (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) return res.status(500).send("خطأ في جلب المستخدمين");
    res.json(rows);
  });
});

// مسح مستخدم
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM users WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).send("خطأ في مسح المستخدم");
    res.send("تم مسح المستخدم بنجاح");
  });
});
