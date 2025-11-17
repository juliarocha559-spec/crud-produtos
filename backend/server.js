const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conecta ao banco SQLite (novo)
const db = new sqlite3.Database("./produtos.db");

// Cria tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    preco TEXT,
    quantidade TEXT,
    categoria TEXT,
    descricao TEXT
  )
`);

// CREATE
app.post("/produtos", (req, res) => {
  const { nome, preco, quantidade, categoria, descricao } = req.body;

  db.run(
    "INSERT INTO produtos (nome, preco, quantidade, categoria, descricao) VALUES (?, ?, ?, ?, ?)",
    [nome, preco, quantidade, categoria, descricao],
    function () {
      res.json({ id: this.lastID });
    }
  );
});

// READ
app.get("/produtos", (req, res) => {
  db.all("SELECT * FROM produtos", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// UPDATE
app.put("/produtos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, preco, quantidade, categoria, descricao } = req.body;

  db.run(
    "UPDATE produtos SET nome = ?, preco = ?, quantidade = ?, categoria = ?, descricao = ? WHERE id = ?",
    [nome, preco, quantidade, categoria, descricao, id],
    function () {
      res.json({ message: "Atualizado!" });
    }
  );
});

// DELETE
app.delete("/produtos/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM produtos WHERE id = ?", [id], function () {
    res.json({ message: "Removido!" });
  });
});

// Inicia o servidor
app.listen(3001, () => {
  console.log("Backend rodando em http://localhost:3001");
});
