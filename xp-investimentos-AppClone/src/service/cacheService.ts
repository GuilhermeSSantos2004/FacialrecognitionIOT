import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "toastify-react-native";

type CacheKey = string;
type CacheValue = any;

// Utilitários simples
export const clearCache = async (keys: CacheKey[]): Promise<void> => {
  try {
    for (const key of keys) {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.error("Erro ao limpar cache:", error);
  }
};

export const saveData = async (
  key: CacheKey,
  value: CacheValue
): Promise<void> => {
  try {
    if (value) {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    }
  } catch (error) {
    console.error(`Erro ao salvar dados na chave "${key}":`, error);
  }
};

export const getData = async (key: CacheKey): Promise<CacheValue | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Erro ao recuperar dados da chave "${key}":`, error);
    return null;
  }
};

export const removeData = async (key: CacheKey): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Erro ao remover dados da chave "${key}":`, error);
  }
};

// Chaves relevantes para app bancário
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  TRANSACTIONS: 'transactions',
  NOTIFICATIONS: 'notifications',
  PIGGY_BANKS: 'piggy_banks',
  INVESTMENTS: 'investments',
  ARTICLES: 'articles',
  GOALS: 'goals',
  PIGGY_TRANSFERS: 'piggy_transfers'
} as const;

export interface Article {
  title: string;
  filter: string;
  imageSource: { uri: string };
}

export interface PiggyBank {
  id: number;
  nome: string;
  valor: number;
  imagem: string;
  meta: number;
  progresso: number;
  descricaoMeta: string;
  dadosGrafico: number[];
  labelsGrafico: string[];
  resumo: {
    saldoInicial: number;
    entradas: number;
    saidas: number;
    diferenca: number;
  };
}

export interface Investment {
  logo: string;
  title: string;
  description: string;
  price: string;
  growth: string;
  growthValue: string;
  chartData: any[];
  acoes: number;
  precoMedio: number;
  valorTotal: number;
  resultado: number;
  resultadoPercentual: number;
}

export interface InvestmentCategory {
  nome: string;
  percentual: string;
  valor: string;
  cor: string;
  icone: string;
}

export interface Notification {
  type: string;
  value: string;
  entity?: string;
  bank?: string;
  document?: string;
  piggyName?: string;
  timestamp: number;
}

export interface PiggyTransferNotification {
  type: "transferido" | "retirado";
  value: string;
  piggyName: string;
  timestamp: number;
}

// Funções para gerenciar notificações
export const cacheNotifications = async (notifications: Notification[]): Promise<void> => {
  
  try {
    await saveData(CACHE_KEYS.NOTIFICATIONS, notifications);
  } catch (error) {
    console.error("Erro ao salvar notificações no cache:", error);
  }
};

export const getCachedNotifications = async (): Promise<Notification[] | null> => {
  try {
    return await getData(CACHE_KEYS.NOTIFICATIONS);
  } catch (error) {
    console.error("Erro ao recuperar notificações do cache:", error);
    return null;
  }
};

export const addNotification = async (notification: Notification): Promise<void> => {
  try {
    const currentNotifications = await getCachedNotifications() || [];
    const updatedNotifications = [...currentNotifications, {
      ...notification,
      timestamp: Date.now()
    }];
    await cacheNotifications(updatedNotifications);
  } catch (error) {
    console.error("Erro ao adicionar notificação:", error);
  }
};

// Funções para gerenciar transferências de cofrinho
export const cachePiggyTransfers = async (transfers: PiggyTransferNotification[]): Promise<void> => {
  try {
    await saveData(CACHE_KEYS.PIGGY_TRANSFERS, transfers);
  } catch (error) {
    console.error("Erro ao salvar transferências de cofrinho no cache:", error);
  }
};

export const getCachedPiggyTransfers = async (): Promise<PiggyTransferNotification[] | null> => {
  try {
    return await getData(CACHE_KEYS.PIGGY_TRANSFERS);
  } catch (error) {
    console.error("Erro ao recuperar transferências de cofrinho do cache:", error);
    return null;
  }
};

export const addPiggyTransfer = async (transfer: Omit<PiggyTransferNotification, 'timestamp'>): Promise<void> => {
  try {
    const currentTransfers = await getCachedPiggyTransfers() || [];
    const updatedTransfers = [...currentTransfers, {
      ...transfer,
      timestamp: Date.now()
    }];
    await cachePiggyTransfers(updatedTransfers);
  } catch (error) {
    console.error("Erro ao adicionar transferência de cofrinho:", error);
  }
};

// Funções para gerenciar artigos
export const cacheArticles = async (articles: Article[]): Promise<void> => {
  try {
    await saveData(CACHE_KEYS.ARTICLES, articles);
  } catch (error) {
    console.error("Erro ao salvar artigos no cache:", error);
  }
};

export const getCachedArticles = async (): Promise<Article[] | null> => {
  try {
    return await getData(CACHE_KEYS.ARTICLES);
  } catch (error) {
    console.error("Erro ao recuperar artigos do cache:", error);
    return null;
  }
};

export const addArticle = async (article: Article): Promise<void> => {
  try {
    const currentArticles = await getCachedArticles() || [];
    const updatedArticles = [...currentArticles, article];
    await cacheArticles(updatedArticles);
  } catch (error) {
    console.error("Erro ao adicionar artigo:", error);
  }
};

// Funções para gerenciar cofrinhos
export const cachePiggyBanks = async (piggyBanks: PiggyBank[]): Promise<void> => {
  try {
    await saveData(CACHE_KEYS.PIGGY_BANKS, piggyBanks);
  } catch (error) {
    console.error("Erro ao salvar cofrinhos no cache:", error);
  }
};

export const getCachedPiggyBanks = async (): Promise<PiggyBank[] | null> => {
  try {
    return await getData(CACHE_KEYS.PIGGY_BANKS);
  } catch (error) {
    console.error("Erro ao recuperar cofrinhos do cache:", error);
    return null;
  }
};

export const addPiggyBank = async (piggyBank: PiggyBank): Promise<any> => {
  try {
    const currentPiggyBanks = await getCachedPiggyBanks() || [];
    const updatedPiggyBanks = [...currentPiggyBanks, piggyBank];
    await cachePiggyBanks(updatedPiggyBanks);
    return updatePiggyBank
  } catch (error) {
    console.error("Erro ao adicionar cofrinho:", error);
  }
};

export const updatePiggyBank = async (id: number, updates: Partial<PiggyBank>): Promise<void> => {
  try {
    const currentPiggyBanks = await getCachedPiggyBanks() || [];
    const updatedPiggyBanks = currentPiggyBanks.map(piggy => 
      piggy.id === id ? { ...piggy, ...updates } : piggy
    );
    await cachePiggyBanks(updatedPiggyBanks);
  } catch (error) {
    console.error("Erro ao atualizar cofrinho:", error);
  }
};

// Funções para gerenciar investimentos
export const cacheInvestments = async (investments: Investment[]): Promise<void> => {
  try {
    await saveData(CACHE_KEYS.INVESTMENTS, investments);
  } catch (error) {
    console.error("Erro ao salvar investimentos no cache:", error);
  }
};

export const getCachedInvestments = async (): Promise<Investment[] | null> => {
  try {
    return await getData(CACHE_KEYS.INVESTMENTS);
  } catch (error) {
    console.error("Erro ao recuperar investimentos do cache:", error);
    return null;
  }
};

export const addInvestment = async (investment: Investment): Promise<void> => {
  try {
    const currentInvestments = await getCachedInvestments() || [];
    const updatedInvestments = [...currentInvestments, investment];
    await cacheInvestments(updatedInvestments);
  } catch (error) {
    console.error("Erro ao adicionar investimento:", error);
  }
};

// Funções para gerenciar categorias de investimentos
export const cacheInvestmentCategories = async (categories: InvestmentCategory[]): Promise<void> => {
  try {
    await saveData('investment_categories', categories);
  } catch (error) {
    console.error("Erro ao salvar categorias de investimento no cache:", error);
  }
};

export const getCachedInvestmentCategories = async (): Promise<InvestmentCategory[] | null> => {
  try {
    return await getData('investment_categories');
  } catch (error) {
    console.error("Erro ao recuperar categorias de investimento do cache:", error);
    return null;
  }
};

// Função para inicializar dados padrão no cache
export const initializeDefaultData = async (): Promise<void> => {
  try {
    // Verificar se os dados já existem
    const existingArticles = await getCachedArticles();
    const existingPiggyBanks = await getCachedPiggyBanks();
    const existingInvestments = await getCachedInvestments();
    const existingCategories = await getCachedInvestmentCategories();
    const existingNotifications = await getCachedNotifications();
    const existingPiggyTransfers = await getCachedPiggyTransfers();

    // Dados padrão para artigos (apenas se não existirem)
    if (!existingArticles || existingArticles.length === 0) {
      const defaultArticles: Article[] = [
        {
          title: "Investimentos de alto Risco",
          filter: "Investimentos",
          imageSource: {
            uri: "substituir",
          },
        },
        {
          title: "Investimentos de alto Risco",
          filter: "Investimentos",
          imageSource: {
            uri: "substituir",
          },
        },
        {
          title: "Investimentos de alto Risco",
          filter: "Investimentos",
          imageSource: {
            uri: "substituir",
          },
        },
      ];
      await cacheArticles(defaultArticles);
    }

    // Dados padrão para cofrinhos (apenas se não existirem)
    if (!existingPiggyBanks || existingPiggyBanks.length === 0) {
      const defaultPiggyBanks: PiggyBank[] = [
        {
          id: 1,
          nome: "Carro",
          valor: 4500,
          imagem: "https://cdn.motor1.com/images/mgl/AkB8vL/s3/fiat-mobi-2023.jpg",
          meta: 20000,
          progresso: 0.225,
          descricaoMeta: "Você já economizou R$4.500,00. Continue acelerando rumo ao seu carro novo!",
          dadosGrafico: [500, 1200, 1800, 2500, 3200, 3900, 4500],
          labelsGrafico: ["jan", "fev", "mar", "abr", "mai", "jun", "jul"],
          resumo: {
            saldoInicial: 500,
            entradas: 4500,
            saidas: 100,
            diferenca: 4400,
          },
        },
        {
          id: 2,
          nome: "Viagem",
          valor: 3200,
          imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6aRsHlyASeZvUJgL7Wzy8UMEPsUKdGp7wRg&s",
          meta: 10000,
          progresso: 0.32,
          descricaoMeta: "Faltam R$6.800,00 para sua viagem dos sonhos. Continue firme!",
          dadosGrafico: [300, 800, 1300, 1900, 2500, 2800, 3200],
          labelsGrafico: ["jan", "fev", "mar", "abr", "mai", "jun", "jul"],
          resumo: {
            saldoInicial: 300,
            entradas: 3200,
            saidas: 200,
            diferenca: 3000,
          },
        },
        {
          id: 3,
          nome: "Reserva de Emergência",
          valor: 8000,
          imagem: "https://investidorsardinha.r7.com/wp-content/uploads/2022/01/quando-usar-a-reserva-de-emergencia-veja-algumas-situacoes.jpg",
          meta: 12000,
          progresso: 0.666,
          descricaoMeta: "R$8.000,00 guardados para emergências. Ótimo trabalho!",
          dadosGrafico: [1000, 2500, 3500, 4800, 5800, 7000, 8000],
          labelsGrafico: ["jan", "fev", "mar", "abr", "mai", "jun", "jul"],
          resumo: {
            saldoInicial: 1000,
            entradas: 8000,
            saidas: 500,
            diferenca: 7500,
          },
        },
        {
          id: 4,
          nome: "Educação",
          valor: 2600,
          imagem: "https://s1.static.brasilescola.uol.com.br/be/conteudo/images/educacao.jpg",
          meta: 8000,
          progresso: 0.325,
          descricaoMeta: "R$2.600,00 poupados para seus estudos. Invista no seu futuro!",
          dadosGrafico: [300, 700, 1100, 1500, 1900, 2200, 2600],
          labelsGrafico: ["jan", "fev", "mar", "abr", "mai", "jun", "jul"],
          resumo: {
            saldoInicial: 300,
            entradas: 2600,
            saidas: 100,
            diferenca: 2500,
          },
        },
      ];
      await cachePiggyBanks(defaultPiggyBanks);
    }

    // Dados padrão para investimentos (apenas se não existirem)
    if (!existingInvestments || existingInvestments.length === 0) {
      const generateChartData = (base: number) => {
        const data = [];
        let lastClose = base;
        for (let i = 0; i < 30; i++) {
          const open = lastClose;
          const change = (Math.random() - 0.5) * 2;
          const close = parseFloat((open + change).toFixed(2));
          const high = Math.max(open, close) + Math.random();
          const low = Math.min(open, close) - Math.random();
          lastClose = close;
          data.push({
            open,
            close,
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
          });
        }
        return data;
      };

      const defaultInvestments: Investment[] = [
        {
          logo: "https://t.ctcdn.com.br/aFp_I8ScTJJch32H29ImNebDEYU=/i489949.jpeg",
          title: "Apple Inc.",
          description: "AAPL | Nasdaq",
          price: "190.45",
          growth: "1.82",
          growthValue: "3.42",
          chartData: generateChartData(190),
          acoes: 10,
          precoMedio: 180.0,
          valorTotal: 1904.5,
          resultado: 104.5,
          resultadoPercentual: 5.8,
        },
        {
          logo: "https://t.ctcdn.com.br/t_kuAtuj3qpV2DVpBvVYSHOIwco=/1080x1080/smart/i606944.png",
          title: "Alphabet Inc.",
          description: "GOOGL | Nasdaq",
          price: "135.67",
          growth: "2.45",
          growthValue: "5.72",
          chartData: generateChartData(135),
          acoes: 15,
          precoMedio: 125.0,
          valorTotal: 2035.05,
          resultado: 161.0,
          resultadoPercentual: 8.6,
        },
      ];
      await cacheInvestments(defaultInvestments);
    }

    // Dados padrão para categorias de investimento (apenas se não existirem)
    if (!existingCategories || existingCategories.length === 0) {
      const defaultCategories: InvestmentCategory[] = [
        { nome: "Ações", percentual: "10.0% da carteira", valor: "R$ 18.742,25", cor: "#3F51B5", icone: "📈" },
        { nome: "Criptomoedas", percentual: "15.4% da carteira", valor: "R$ 28.933,11", cor: "#F44336", icone: "🪙" },
        { nome: "Imóveis", percentual: "6.7% da carteira", valor: "R$ 12.530,00", cor: "#4CAF50", icone: "🏠" },
        { nome: "Commodities", percentual: "5.4% da carteira", valor: "R$ 10.177,50", cor: "#FF9800", icone: "🛢️" },
      ];
      await cacheInvestmentCategories(defaultCategories);
    }

    // Dados padrão para notificações (apenas se não existirem)
    if (!existingNotifications || existingNotifications.length === 0) {
      const defaultNotifications: Notification[] = [
        {
          type: "recebida",
          value: "100,00",
          entity: "Empresa LTDA",
          bank: "Banco Nome S.A",
          document: "00.000.000/0000-00",
          timestamp: Date.now() - 86400000, // 1 dia atrás
        },
        {
          type: "enviada",
          value: "250,00",
          entity: "João Silva",
          bank: "Banco XPTO",
          document: "111.111.111-11",
          timestamp: Date.now() - 43200000, // 12 horas atrás
        },
      ];
      await cacheNotifications(defaultNotifications);
    }

    // Dados padrão para transferências de cofrinho (apenas se não existirem)
    if (!existingPiggyTransfers || existingPiggyTransfers.length === 0) {
      const defaultPiggyTransfers: PiggyTransferNotification[] = [
        { type: "transferido", value: "500,00", piggyName: "Reserva de Emergência", timestamp: Date.now() - 172800000 },
        { type: "retirado", value: "150,00", piggyName: "Viagem", timestamp: Date.now() - 129600000 },
        { type: "transferido", value: "300,00", piggyName: "Educação", timestamp: Date.now() - 86400000 },
        { type: "retirado", value: "100,00", piggyName: "Carro", timestamp: Date.now() - 43200000 },
        { type: "transferido", value: "250,00", piggyName: "Viagem", timestamp: Date.now() - 21600000 },
        { type: "retirado", value: "50,00", piggyName: "Reserva de Emergência", timestamp: Date.now() - 10800000 },
      ];
      await cachePiggyTransfers(defaultPiggyTransfers);
    }

  } catch (error) {
    console.error("Erro ao inicializar dados padrão:", error);
  }
};

// Função para limpar todos os dados das páginas
export const clearPagesCache = async (): Promise<void> => {
  try {
    await clearCache([
      CACHE_KEYS.ARTICLES,
      CACHE_KEYS.PIGGY_BANKS,
      CACHE_KEYS.INVESTMENTS,
      CACHE_KEYS.NOTIFICATIONS,
      CACHE_KEYS.PIGGY_TRANSFERS,
      'investment_categories'
    ]);
  } catch (error) {
    console.error("Erro ao limpar cache das páginas:", error);
  }
};

// Função para obter estatísticas do cache
export const getCacheStats = async (): Promise<Record<string, number>> => {
  try {
    const articles = await getCachedArticles() || [];
    const piggyBanks = await getCachedPiggyBanks() || [];
    const investments = await getCachedInvestments() || [];
    const categories = await getCachedInvestmentCategories() || [];
    const notifications = await getCachedNotifications() || [];
    const piggyTransfers = await getCachedPiggyTransfers() || [];

    return {
      articles: articles.length,
      piggyBanks: piggyBanks.length,
      investments: investments.length,
      categories: categories.length,
      notifications: notifications.length,
      piggyTransfers: piggyTransfers.length,
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas do cache:", error);
    return {};
  }
};