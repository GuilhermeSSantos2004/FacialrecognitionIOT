import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Box from '../../../atoms/Box';
import TitleWithLine from '../../../atoms/TitleWithUnderline';
import InvestmentCard from '../../../molecules/InvestimentCard';

interface InvestmentData {
  logo: string;
  title: string;
  description: string;
  price: string;
  growth: string;
  growthValue: string;
  chartData: {
    open: number;
    close: number;
    high: number;
    low: number;
  }[];
  acoes: number;
  precoMedio: number;
  valorTotal: number;
  resultado: number;
  resultadoPercentual: number;
  type? : string;
}


interface InvestmentsListProps {
  data: InvestmentData[];
  showTitle?: boolean; // novo prop
  uniqueKey?: string;

  }

const InvestmentList001: React.FC<InvestmentsListProps> = ({ data, showTitle = true }) => {
  return (
    <Box>
      {showTitle && (
        <View style={styles.header}>
          <TitleWithLine title="Investimentos em alta" />
        </View>
      )}
      <View style={styles.scrollView}>
        <View style={styles.list}>
          {data.map((investment, index) => (
             <InvestmentCard key={`${investment.title}_${index}`} {...investment} />
          ))}
        </View>
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  list: {
    paddingBottom: 20,
  },
});

export default InvestmentList001;
