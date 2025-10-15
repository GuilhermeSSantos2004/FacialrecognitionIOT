import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import InvestmentCard from '../molecules/InvestimentCard';
import TitleWithLine from '../atoms/TitleWithUnderline';
import Box from '../atoms/Box';

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
}

interface InvestmentsListProps {
  data: InvestmentData[];
}

const InvestmentsList: React.FC<InvestmentsListProps> = ({ data }) => {
  return (
    <Box>
      <View style={styles.header}>
        <TitleWithLine title="Investimentos em alta" />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {data.map((investment, index) => (
            <InvestmentCard key={index} {...investment} />
          ))}
        </View>
      </ScrollView>
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

export default InvestmentsList;
