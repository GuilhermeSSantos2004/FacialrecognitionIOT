const express = require('express');
const router = express.Router();
const {
  getPiggyBanks,
  getPiggyBankById,
  createPiggyBank,
  updatePiggyBank,
  deletePiggyBank
} = require('../controllers/piggyBankController');
const { authMiddleware } = require('../middleware/auth');

// Todas as rotas de cofrinho requerem autenticação
router.use(authMiddleware);

router.get('/', getPiggyBanks);
router.get('/:id', getPiggyBankById);
router.post('/', createPiggyBank);
router.put('/:id', updatePiggyBank);
router.delete('/:id', deletePiggyBank);

module.exports = router;
