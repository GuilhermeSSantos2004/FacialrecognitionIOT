const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

   
    console.log(`👋 Bem-vindo, ${user.username}!`);

    return res.json({
      message: `Bem-vindo, ${user.username}!`,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  });
};

const register = (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
    [username, hashedPassword, email],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Usuário já existe' });
        }
        console.error('Erro ao criar usuário:', err.message);
        return res.status(500).json({ error: 'Erro ao criar usuário' });
      }

      const token = jwt.sign(
        { id: this.lastID, username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        token,
        user: {
          id: this.lastID,
          username,
          email
        }
      });
    }
  );
};

const getProfile = (req, res) => {
  db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err) {
      console.error('Erro ao buscar perfil:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar perfil' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(user);
  });
};

module.exports = { login, register, getProfile };
