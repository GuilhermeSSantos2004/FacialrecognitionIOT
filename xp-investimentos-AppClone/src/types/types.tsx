import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamListType = {
  Login: undefined;
  HomeTab: undefined;

  Feed: NavigatorScreenParams<FeedStackParamList>;
  Cofrinho: NavigatorScreenParams<CofrinhoParamList>;
  Carteira: NavigatorScreenParams<InvestimentoStackParamListType>;

  Conta: undefined;
};
  
export type InvestimentoStackParamListType = {
  Investimento: undefined;
  InvestimentoDetails: {
    nome: string;
    empresa: string;
    precoAtual: number;
    variacao: number;
    variacaoPercentual: number;
    acoes: number;
    precoMedio: number;
    valorTotal: number;
    resultado: number;
    resultadoPercentual: number;
    chartData: {
      open: number;
      close: number;
      high: number;
      low: number;
    }[];
    logo: any
  };
  InvestimentoBuy: {
      nome: any,
      empresa: any,
      precoAtual: any,
      variacao: any,
      variacaoPercentual: any,
      acoes: any,
      precoMedio: any,
      valorTotal: any,
      resultado: any,
      resultadoPercentual: any,
      chartData: any,
      logo: any,
  };
  InvestimentoSell: {
    nome: string;
    precoAtual: number;
    acoesDisponiveis: number;
    precoMedio: number;
    acoes: number;
  };
  InvestimentoSearch: {
    initialFilter: string
  }
};



export type FeedStackParamList = {
  Home: undefined;
  EducaArticleDetail: {
    title: string;
    subtitle: string;
    content: string;
    imageSource: any;
    source?: string;
  }
}
export type CofrinhoParamList = {
    Cofre: { refresh?: boolean } | undefined;
    Cadastro: undefined;
CofrinhoDetails: {
  objetivo: string;
  saldoAtual: number;
  mostrarSaldo: boolean;
  meta: number;
  progresso: number; // de 0 a 1
  descricaoMeta: string;
  dadosGrafico: number[];
  labelsGrafico: string[];
  resumo: {
    saldoInicial: number;
    entradas: number;
    saidas: number;
    diferenca: number;
  };
};

  };