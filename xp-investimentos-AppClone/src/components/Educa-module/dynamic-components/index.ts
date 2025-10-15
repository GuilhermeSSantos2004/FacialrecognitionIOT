import EducaSnippet001 from './Educa_snippet_001';
import EducaArticle002 from './Educa_articles_002';
import InvestmentList001 from './Investment_list_001';

export const getComponentByCode = (code: string) => {
  const components: Record<string, React.FC<any>> = {
    EDU_SNIPPET_001: EducaSnippet001,
    EDU_ARTICLE_002: EducaArticle002,
    INVEST_LIST_001: InvestmentList001
  };

  return components[code] || null;
};
