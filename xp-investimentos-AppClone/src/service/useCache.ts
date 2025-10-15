
import { useState, useEffect } from 'react';
import {
  getCachedArticles,
  getCachedPiggyBanks,
  getCachedInvestments,
  getCachedInvestmentCategories,
  getCachedNotifications,
  getCachedPiggyTransfers,
  cacheArticles,
  cachePiggyBanks,
  cacheInvestments,
  cacheNotifications,
  cachePiggyTransfers,
  addArticle,
  addPiggyBank,
  addInvestment,
  addNotification,
  addPiggyTransfer,
  updatePiggyBank,
  initializeDefaultData,
  clearPagesCache,
  getCacheStats,
  Article,
  PiggyBank,
  Investment,
  InvestmentCategory,
  Notification,
  PiggyTransferNotification
} from './cacheService'; // ajuste o caminho conforme necessário

export const useCache = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [piggyBanks, setPiggyBanks] = useState<PiggyBank[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [categories, setCategories] = useState<InvestmentCategory[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [piggyTransfers, setPiggyTransfers] = useState<PiggyTransferNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, number>>({});
  console.log(piggyBanks.length)
  const loadCacheData = async () => {
    try {
      setLoading(true);
      const [
        cachedArticles,
        cachedPiggyBanks,
        cachedInvestments,
        cachedCategories,
        cachedNotifications,
        cachedPiggyTransfers
      ] = await Promise.all([
        getCachedArticles(),
        getCachedPiggyBanks(),
        getCachedInvestments(),
        getCachedInvestmentCategories(),
        getCachedNotifications(),
        getCachedPiggyTransfers()
      ]);
      console.log(cachedPiggyBanks?.length)
      if (cachedArticles) setArticles(cachedArticles);
      if (cachedPiggyBanks) setPiggyBanks(cachedPiggyBanks);
      if (cachedInvestments) setInvestments(cachedInvestments);
      if (cachedCategories) setCategories(cachedCategories);
      if (cachedNotifications) setNotifications(cachedNotifications);
      if (cachedPiggyTransfers) setPiggyTransfers(cachedPiggyTransfers);

      const cacheStats = await getCacheStats();
      setStats(cacheStats);
    } catch (error) {
      console.error('Erro ao carregar dados do cache:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeData = async () => {
    try {
      setLoading(true);
      await initializeDefaultData();
      await loadCacheData();
    } catch (error) {
      console.error('Erro ao inicializar dados:', error);
    } finally {
      setLoading(false);
    }
  };
   const refreshCache = async () => {
    try {
      setLoading(true);
      await loadCacheData();
    } catch (error) {
      console.error('Erro ao inicializar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    const cacheStats = await getCacheStats();
    setStats(cacheStats);
  };

  useEffect(() => {
    loadCacheData();
  }, []);

  return {
    articles,
    piggyBanks,
    investments,
    categories,
    notifications,
    piggyTransfers,
    loading,
    stats,
    setPiggyBanks,
    refreshStats,
    loadCacheData,
    initializeData,
    refreshCache,
    clearPagesCache,
    cacheArticles,
    cachePiggyBanks,
    cacheInvestments,
    cacheNotifications,
    cachePiggyTransfers,
    addArticle,
    addPiggyBank,
    addInvestment,
    addNotification,
    addPiggyTransfer,
    updatePiggyBank
  };
};

export { addInvestment };
