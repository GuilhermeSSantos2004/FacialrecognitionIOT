const express = require('express');
const router = express.Router();
const {
  getInvestments,
  getInvestmentById,
  createInvestment,
  updateInvestment,
  deleteInvestment
} = require('../controllers/investmentController');
const { authMiddleware } = require('../middleware/auth');

// Todas as rotas de investimento requerem autenticação
router.use(authMiddleware);

router.get('/', getInvestments);
router.get('/:id', getInvestmentById);
router.post('/', createInvestment);
router.put('/:id', updateInvestment);
router.delete('/:id', deleteInvestment);

module.exports = router;
