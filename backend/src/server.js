const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const piggyBankRoutes = require('./routes/piggyBankRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.get('/', (req, res) => {
  res.json({
    message: 'API AdvInvestor - Backend',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      investments: '/api/investments',
      piggyBanks: '/api/piggy-banks'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/piggy-banks', piggyBankRoutes);

// Tratamento de erro 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API disponível em: http://localhost:${PORT}`);
  console.log(`\n📝 Endpoints disponíveis:`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/register`);
  console.log(`   GET    http://localhost:${PORT}/api/auth/profile`);
  console.log(`   GET    http://localhost:${PORT}/api/investments`);
  console.log(`   POST   http://localhost:${PORT}/api/investments`);
  console.log(`   PUT    http://localhost:${PORT}/api/investments/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/investments/:id`);
  console.log(`   GET    http://localhost:${PORT}/api/piggy-banks`);
  console.log(`   POST   http://localhost:${PORT}/api/piggy-banks`);
  console.log(`   PUT    http://localhost:${PORT}/api/piggy-banks/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/piggy-banks/:id`);
  console.log(`\n💡 Usuário padrão: admin / 1234\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar banco de dados:', err.message);
    } else {
      console.log('\n✅ Conexão com banco de dados fechada.');
    }
    process.exit(0);
  });
});

module.exports = app;
