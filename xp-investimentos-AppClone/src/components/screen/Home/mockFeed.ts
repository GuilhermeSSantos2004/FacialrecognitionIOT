
 const handlers = {
    handleTesouroClick: (title: string) => {
      console.log("Clicou em Saiba mais sobre Tesouro Direto");
    },
  };

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

export const mockData = [
  {
    code: "EDU_SNIPPET_001",
    props: {
      title: "O que é Tesouro Direto?",
      subtitle: "Comece a investir com segurança, entendendo os passos básicos para proteger seu dinheiro e obter bons resultados.",
      content: "Investir no Tesouro Direto é uma das formas mais seguras e acessíveis para quem está começando a entrar no mundo dos investimentos. Trata-se de um programa do Tesouro Nacional que permite a compra de títulos públicos pela internet, com valores iniciais bastante baixos, tornando essa modalidade ideal para investidores iniciantes que querem aprender a investir com pouco dinheiro. Os títulos públicos funcionam como empréstimos que você faz ao governo federal, que em troca paga uma remuneração definida no momento da compra. Essa remuneração pode ser prefixada (com taxa fixa), pós-fixada (atrelada à taxa Selic) ou atrelada à inflação, oferecendo opções para diferentes perfis e objetivos financeiros. Além de ser uma opção considerada de baixo risco, o Tesouro Direto ajuda o investidor a compreender o funcionamento do mercado financeiro, a importância do planejamento financeiro e a disciplina para investir regularmente. Com liquidez diária em muitos dos títulos, o investidor pode resgatar seu dinheiro quando precisar, o que traz mais flexibilidade e segurança. Portanto, começar a investir no Tesouro Direto é um passo inteligente para quem deseja construir uma reserva financeira sólida, aprender sobre o mercado e, aos poucos, desenvolver confiança para diversificar sua carteira com outros ativos.",
      imageSource: {
        uri: "https://agenciagov.ebc.com.br/noticias/202309/programa-tesouro-direto-atinge-em-agosto-o-maior-aumento-mensal-de-investidores-ativos/@@download/image/GettyImages-1340801325-1.jpg"
      },
      source: "agenciagov.ebc.com.br",
      seeMoreText: "Saiba mais",
      onSeeMorePress: handlers.handleTesouroClick,
    },
  },
{
  code: "INVEST_LIST_001",
  props: {
    data: [
      {
        logo: "https://logo.clearbit.com/apple.com",
        title: "Apple Inc.",
        description: "AAPL | Nasdaq",
        price: "190.45",
        growth: "1.82",
        growthValue: "3.42",
        chartData: generateChartData(190),
        acoes: 10,
        precoMedio: 180.00,
        valorTotal: 1904.50,
        resultado: 104.50,
        resultadoPercentual: 5.8,
      },
      {
        logo: "https://logo.clearbit.com/google.com",
        title: "Alphabet Inc.",
        description: "GOOGL | Nasdaq",
        price: "135.67",
        growth: "2.45",
        growthValue: "5.72",
        chartData: generateChartData(135),
        acoes: 15,
        precoMedio: 125.00,
        valorTotal: 2035.05,
        resultado: 161.00,
        resultadoPercentual: 8.6,
      },
    ],
  },
},
  {
    code: "EDU_ARTICLE_002",
    props: {
      sectionTitle: "Dicas para iniciantes",
      articles: [
        {
          imageSource: { uri: "https://assets-blog.pagseguro.uol.com.br/wp-content/2021/04/shutterstock_2152371775-1-min.jpg" },
          title: "Invista com pouco dinheiro",
          content: "Mesmo R$ 30 já é suficiente para começar com Tesouro Direto.",
        },
        {
          imageSource: { uri: "data:image/jpeg;base64,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"},
          title: "Crie uma reserva de emergência",
          content: "Antes de arriscar, garanta sua segurança financeira.",
        },
      ],
    },
  },
  {
    code: "EDU_SNIPPET_001",
    props: {
      title: "O que são Ações?",
subtitle: "Ao investir em ações, você se torna sócio da empresa, participando dos lucros e das decisões. Descubra como seu investimento pode crescer e os riscos envolvidos.",
      content: "Quando você compra uma ação, está se tornando sócio de uma empresa. Isso significa participar dos lucros e prejuízos da companhia e se beneficiar da sua valorização ao longo do tempo.",
      imageSource: {
        uri: "https://assets-blog.pagseguro.uol.com.br/wp-content/2021/12/shutterstock_1917266012-2.jpg"
      },
      source: "blog.pagseguro.uol.com.br",
      seeMoreText: "Entenda melhor",
      onSeeMorePress: handlers.handleTesouroClick,
    },
  },
{
  code: "INVEST_LIST_001",
  props: {
    data: [
      {
        logo: "https://logo.clearbit.com/amazon.com",
        title: "Amazon.com Inc.",
        description: "AMZN | Nasdaq",
        price: "115.23",
        growth: "0.75",
        growthValue: "0.86",
        chartData: generateChartData(115),
        acoes: 5,
        precoMedio: 110.00,
        valorTotal: 576.15,
        resultado: 26.00,
        resultadoPercentual: 4.7,
      },
      {
        logo: "https://logo.clearbit.com/microsoft.com",
        title: "Microsoft Corp.",
        description: "MSFT | Nasdaq",
        price: "250.60",
        growth: "1.95",
        growthValue: "4.12",
        chartData: generateChartData(250),
        acoes: 8,
        precoMedio: 240.00,
        valorTotal: 2004.80,
        resultado: 84.80,
        resultadoPercentual: 4.4,
      },
    ],
  },
}
];