const db = require('../config/database');

// Listar todos os cofrinhos do usuário
const getPiggyBanks = (req, res) => {
  const userId = req.userId;

  db.all(
    'SELECT * FROM piggy_banks WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, piggyBanks) => {
      if (err) {
        console.error('Erro ao buscar cofrinhos:', err.message);
        return res.status(500).json({ error: 'Erro ao buscar cofrinhos' });
      }

      // Formatar para o padrão do frontend
      const formattedPiggyBanks = piggyBanks.map(pb => ({
        id: pb.id,
        nome: pb.nome,
        valor: pb.valor,
        imagem: pb.imagem,
        meta: pb.meta,
        progresso: pb.progresso,
        descricaoMeta: pb.descricao_meta,
        dadosGrafico: JSON.parse(pb.dados_grafico || '[]'),
        labelsGrafico: JSON.parse(pb.labels_grafico || '[]'),
        resumo: JSON.parse(pb.resumo || '{}'),
        tipo: pb.tipo
      }));

      return res.json(formattedPiggyBanks);
    }
  );
};

// Buscar um cofrinho específico
const getPiggyBankById = (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  db.get(
    'SELECT * FROM piggy_banks WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, piggyBank) => {
      if (err) {
        console.error('Erro ao buscar cofrinho:', err.message);
        return res.status(500).json({ error: 'Erro ao buscar cofrinho' });
      }

      if (!piggyBank) {
        return res.status(404).json({ error: 'Cofrinho não encontrado' });
      }

      const formattedPiggyBank = {
        id: piggyBank.id,
        nome: piggyBank.nome,
        valor: piggyBank.valor,
        imagem: piggyBank.imagem,
        meta: piggyBank.meta,
        progresso: piggyBank.progresso,
        descricaoMeta: piggyBank.descricao_meta,
        dadosGrafico: JSON.parse(piggyBank.dados_grafico || '[]'),
        labelsGrafico: JSON.parse(piggyBank.labels_grafico || '[]'),
        resumo: JSON.parse(piggyBank.resumo || '{}'),
        tipo: piggyBank.tipo
      };

      return res.json(formattedPiggyBank);
    }
  );
};

// Criar novo cofrinho
const createPiggyBank = (req, res) => {
  const userId = req.userId;
  const {
    nome,
    meta,
    imagem,
    tipo = "100"
  } = req.body;

  if (!nome || !meta) {
    return res.status(400).json({ error: 'Nome e meta são obrigatórios' });
  }

  const valor = 0;
  const progresso = 0;
  const descricaoMeta = `R$0,00 poupados para ${nome}.`;
  const dadosGrafico = JSON.stringify([0, 0, 0, 0, 0, 0, 0]);
  const labelsGrafico = JSON.stringify(["jan", "fev", "mar", "abr", "mai", "jun", "jul"]);
  const resumo = JSON.stringify({
    saldoInicial: 0,
    entradas: 0,
    saidas: 0,
    diferenca: 0
  });

  db.run(
    `INSERT INTO piggy_banks
    (user_id, nome, valor, imagem, meta, progresso, descricao_meta, dados_grafico, labels_grafico, resumo, tipo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      nome,
      valor,
      imagem,
      parseFloat(meta),
      progresso,
      descricaoMeta,
      dadosGrafico,
      labelsGrafico,
      resumo,
      tipo
    ],
    function (err) {
      if (err) {
        console.error('Erro ao criar cofrinho:', err.message);
        return res.status(500).json({ error: 'Erro ao criar cofrinho' });
      }

      return res.status(201).json({
        message: 'Cofrinho criado com sucesso',
        piggyBank: {
          id: this.lastID,
          nome,
          valor,
          imagem,
          meta: parseFloat(meta),
          progresso,
          descricaoMeta,
          dadosGrafico: JSON.parse(dadosGrafico),
          labelsGrafico: JSON.parse(labelsGrafico),
          resumo: JSON.parse(resumo),
          tipo
        }
      });
    }
  );
};

// Atualizar cofrinho (adicionar/remover dinheiro)
const updatePiggyBank = (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { valor, operacao } = req.body; // operacao: 'adicionar' ou 'retirar'

  // Primeiro busca o cofrinho atual
  db.get(
    'SELECT * FROM piggy_banks WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, piggyBank) => {
      if (err) {
        console.error('Erro ao buscar cofrinho:', err.message);
        return res.status(500).json({ error: 'Erro ao buscar cofrinho' });
      }

      if (!piggyBank) {
        return res.status(404).json({ error: 'Cofrinho não encontrado' });
      }

      let novoValor = piggyBank.valor;
      const valorOperacao = parseFloat(valor);

      if (operacao === 'adicionar') {
        novoValor += valorOperacao;
      } else if (operacao === 'retirar') {
        if (valorOperacao > piggyBank.valor) {
          return res.status(400).json({ error: 'Valor insuficiente no cofrinho' });
        }
        novoValor -= valorOperacao;
      } else {
        return res.status(400).json({ error: 'Operação inválida. Use "adicionar" ou "retirar"' });
      }

      const novoProgresso = novoValor / piggyBank.meta;
      const novaDescricao = `R$${novoValor.toFixed(2).replace('.', ',')} poupados para ${piggyBank.nome}.`;

      // Atualizar resumo
      const resumo = JSON.parse(piggyBank.resumo || '{}');
      if (operacao === 'adicionar') {
        resumo.entradas = (resumo.entradas || 0) + valorOperacao;
      } else {
        resumo.saidas = (resumo.saidas || 0) + valorOperacao;
      }
      resumo.diferenca = (resumo.entradas || 0) - (resumo.saidas || 0);

      db.run(
        `UPDATE piggy_banks
        SET valor = ?, progresso = ?, descricao_meta = ?, resumo = ?
        WHERE id = ? AND user_id = ?`,
        [
          novoValor,
          novoProgresso,
          novaDescricao,
          JSON.stringify(resumo),
          id,
          userId
        ],
        function (err) {
          if (err) {
            console.error('Erro ao atualizar cofrinho:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar cofrinho' });
          }

          return res.json({
            message: 'Cofrinho atualizado com sucesso',
            piggyBank: {
              id: parseInt(id),
              valor: novoValor,
              progresso: novoProgresso,
              descricaoMeta: novaDescricao,
              resumo
            }
          });
        }
      );
    }
  );
};

// Deletar cofrinho
const deletePiggyBank = (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  db.run(
    'DELETE FROM piggy_banks WHERE id = ? AND user_id = ?',
    [id, userId],
    function (err) {
      if (err) {
        console.error('Erro ao deletar cofrinho:', err.message);
        return res.status(500).json({ error: 'Erro ao deletar cofrinho' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Cofrinho não encontrado' });
      }

      return res.json({ message: 'Cofrinho deletado com sucesso' });
    }
  );
};

module.exports = {
  getPiggyBanks,
  getPiggyBankById,
  createPiggyBank,
  updatePiggyBank,
  deletePiggyBank
};
