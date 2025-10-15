const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criar tabelas
db.serialize(() => {
  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela users:', err.message);
    }
  });

  // Tabela de investimentos
  db.run(`
    CREATE TABLE IF NOT EXISTS investments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      logo TEXT,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      growth REAL,
      growth_value REAL,
      acoes INTEGER DEFAULT 0,
      preco_medio REAL DEFAULT 0,
      valor_total REAL DEFAULT 0,
      resultado REAL DEFAULT 0,
      resultado_percentual REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela investments:', err.message);
    }
  });

  // Tabela de cofrinhos
  db.run(`
    CREATE TABLE IF NOT EXISTS piggy_banks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      valor REAL DEFAULT 0,
      imagem TEXT,
      meta REAL NOT NULL,
      progresso REAL DEFAULT 0,
      descricao_meta TEXT,
      dados_grafico TEXT,
      labels_grafico TEXT,
      resumo TEXT,
      tipo TEXT DEFAULT '100',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela piggy_banks:', err.message);
    }
  });

  // Inserir usuário padrão (admin/1234) se não existir
  const defaultPassword = bcrypt.hashSync('1234', 10);

  db.get('SELECT * FROM users WHERE username = ?', ['admin'], (err, row) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err.message);
    } else if (!row) {
      db.run(
        'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
        ['admin', defaultPassword, 'admin@advinvestor.com'],
        (err) => {
          if (err) {
            console.error('Erro ao criar usuário padrão:', err.message);
          } else {
            console.log('Usuário padrão criado: admin/1234');
          }
        }
      );
    }
  });
});

module.exports = db;
