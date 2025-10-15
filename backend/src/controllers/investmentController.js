const db = require('../config/database');

// Listar todos os investimentos do usuário
const getInvestments = (req, res) => {
  const userId = req.userId;

  db.all(
    'SELECT * FROM investments WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, investments) => {
      if (err) {
        console.error('Erro ao buscar investimentos:', err.message);
        return res.status(500).json({ error: 'Erro ao buscar investimentos' });
      }

      // Formatar para o padrão do frontend
      const formattedInvestments = investments.map(inv => ({
        id: inv.id,
        logo: inv.logo,
        title: inv.title,
        description: inv.description,
        price: inv.price.toString(),
        growth: inv.growth?.toString() || '0',
        growthValue: inv.growth_value?.toString() || '0',
        acoes: inv.acoes,
        precoMedio: inv.preco_medio,
        valorTotal: inv.valor_total,
        resultado: inv.resultado,
        resultadoPercentual: inv.resultado_percentual,
        chartData: [] // Pode ser preenchido posteriormente
      }));

      return res.json(formattedInvestments);
    }
  );
};

// Buscar um investimento específico
const getInvestmentById = (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  db.get(
    'SELECT * FROM investments WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, investment) => {
      if (err) {
        console.error('Erro ao buscar investimento:', err.message);
        return res.status(500).json({ error: 'Erro ao buscar investimento' });
      }

      if (!investment) {
        return res.status(404).json({ error: 'Investimento não encontrado' });
      }

      const formattedInvestment = {
        id: investment.id,
        logo: investment.logo,
        title: investment.title,
        description: investment.description,
        price: investment.price.toString(),
        growth: investment.growth?.toString() || '0',
        growthValue: investment.growth_value?.toString() || '0',
        acoes: investment.acoes,
        precoMedio: investment.preco_medio,
        valorTotal: investment.valor_total,
        resultado: investment.resultado,
        resultadoPercentual: investment.resultado_percentual,
        chartData: []
      };

      return res.json(formattedInvestment);
    }
  );
};

// Criar novo investimento (comprar)
const createInvestment = (req, res) => {
  const userId = req.userId;
  const {
    logo,
    title,
    description,
    price,
    growth,
    growthValue,
    acoes,
    precoMedio
  } = req.body;

  if (!title || !price || !acoes) {
    return res.status(400).json({ error: 'Título, preço e quantidade de ações são obrigatórios' });
  }

  const valorTotal = parseFloat(price) * parseInt(acoes);
  const resultado = valorTotal - (parseFloat(precoMedio || price) * parseInt(acoes));
  const resultadoPercentual = precoMedio ? ((parseFloat(price) - parseFloat(precoMedio)) / parseFloat(precoMedio) * 100) : 0;

  db.run(
    `INSERT INTO investments
    (user_id, logo, title, description, price, growth, growth_value, acoes, preco_medio, valor_total, resultado, resultado_percentual)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      logo,
      title,
      description,
      parseFloat(price),
      parseFloat(growth || 0),
      parseFloat(growthValue || 0),
      parseInt(acoes),
      parseFloat(precoMedio || price),
      valorTotal,
      resultado,
      resultadoPercentual
    ],
    function (err) {
      if (err) {
        console.error('Erro ao criar investimento:', err.message);
        return res.status(500).json({ error: 'Erro ao criar investimento' });
      }

      return res.status(201).json({
        message: 'Investimento criado com sucesso',
        investment: {
          id: this.lastID,
          logo,
          title,
          description,
          price: price.toString(),
          growth: (growth || 0).toString(),
          growthValue: (growthValue || 0).toString(),
          acoes: parseInt(acoes),
          precoMedio: parseFloat(precoMedio || price),
          valorTotal,
          resultado,
          resultadoPercentual
        }
      });
    }
  );
};

// Atualizar investimento (comprar mais ou ajustar)
const updateInvestment = (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { acoes, price, growth, growthValue } = req.body;

  // Primeiro busca o investimento atual
  db.get(
    'SELECT * FROM investments WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, investment) => {
      if (err) {
        console.error('Erro ao buscar investimento:', err.message);
        return res.status(500).json({ error: 'Erro ao buscar investimento' });
      }

      if (!investment) {
        return res.status(404).json({ error: 'Investimento não encontrado' });
      }

      // Calcular novos valores
      const novasAcoes = acoes !== undefined ? parseInt(acoes) : investment.acoes;
      const novoPreco = price !== undefined ? parseFloat(price) : investment.price;
      const novoGrowth = growth !== undefined ? parseFloat(growth) : investment.growth;
      const novoGrowthValue = growthValue !== undefined ? parseFloat(growthValue) : investment.growth_value;

      // Calcular preço médio ponderado se houver compra adicional
      let novoPrecoMedio = investment.preco_medio;
      if (acoes !== undefined && acoes > investment.acoes) {
        const acoesAdicionais = acoes - investment.acoes;
        const valorAntigo = investment.preco_medio * investment.acoes;
        const valorNovo = novoPreco * acoesAdicionais;
        novoPrecoMedio = (valorAntigo + valorNovo) / novasAcoes;
      }

      const valorTotal = novoPreco * novasAcoes;
      const resultado = valorTotal - (novoPrecoMedio * novasAcoes);
      const resultadoPercentual = ((novoPreco - novoPrecoMedio) / novoPrecoMedio * 100);

      db.run(
        `UPDATE investments
        SET acoes = ?, price = ?, growth = ?, growth_value = ?, preco_medio = ?,
            valor_total = ?, resultado = ?, resultado_percentual = ?
        WHERE id = ? AND user_id = ?`,
        [
          novasAcoes,
          novoPreco,
          novoGrowth,
          novoGrowthValue,
          novoPrecoMedio,
          valorTotal,
          resultado,
          resultadoPercentual,
          id,
          userId
        ],
        function (err) {
          if (err) {
            console.error('Erro ao atualizar investimento:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar investimento' });
          }

          return res.json({
            message: 'Investimento atualizado com sucesso',
            investment: {
              id: parseInt(id),
              acoes: novasAcoes,
              price: novoPreco.toString(),
              precoMedio: novoPrecoMedio,
              valorTotal,
              resultado,
              resultadoPercentual
            }
          });
        }
      );
    }
  );
};

// Deletar investimento (vender tudo)
const deleteInvestment = (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  db.run(
    'DELETE FROM investments WHERE id = ? AND user_id = ?',
    [id, userId],
    function (err) {
      if (err) {
        console.error('Erro ao deletar investimento:', err.message);
        return res.status(500).json({ error: 'Erro ao deletar investimento' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Investimento não encontrado' });
      }

      return res.json({ message: 'Investimento deletado com sucesso' });
    }
  );
};

module.exports = {
  getInvestments,
  getInvestmentById,
  createInvestment,
  updateInvestment,
  deleteInvestment
};
