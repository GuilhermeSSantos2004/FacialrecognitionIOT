import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import CandleStickChart from '../atoms/CandleStickChart';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InvestimentoStackParamListType, RootStackParamListType } from '../../types/types'; // ajuste o caminho se necessário

const { width: screenWidth } = Dimensions.get('window');

interface InvestmentCardProps {
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

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  logo,
  title,
  description,
  price,
  growth,
  growthValue,
  chartData,
  acoes,
  precoMedio,
  valorTotal,
  resultado,
  resultadoPercentual
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamListType>>();

  const [expanded, setExpanded] = useState(false);
  const isPositive = !growth.startsWith('-');

  if (expanded) {
    return (
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.expandedCard}>
        <View style={styles.expandedContent}>
          {/* Header Row */}
          <View style={styles.expandedHeader}>
            <View style={styles.leftSection}>
              <View style={styles.headerText}>
                <Text style={styles.expandedTitle}>{title}</Text>
                <Text style={styles.expandedDescription}>{description}</Text>
                <Text style={styles.stockValue}>
                  Valor da ação: <Text style={styles.stockPrice}>R$ {price}</Text>
                </Text>
                <Text style={styles.growthText}>
                  Crescimento de {growth} ou R${growthValue} {isPositive ? '↗' : '↘'}
                </Text>
                <Text style={styles.afterGrowthText}>
                  Valor da ação após crescimento é de{' '}
                  <Text style={styles.afterGrowthValue}>R$ {price}</Text>
                </Text>
              </View>
            </View>
            
            <View style={styles.rightSection}>
              <View style={styles.priceContainer}>

              </View>
              
              <View style={styles.investmentTip}>
                <Text style={styles.tipText}>
                  Caso decida investir R$100,00.{'\n'}
                  Em 3 meses seu investimento{'\n'}
                  pode alcançar um crescimento de{'\n'}
                  R$ 100, totalizando{'\n'}
                  R$101,00.
                </Text>
              </View>
            </View>
          </View>

          {/* Chart Section */}
          <View style={styles.chartSection}>
            <CandleStickChart
              data={chartData}
              height={180}
              candleWidth={6}
              spacing={2}
            />
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
<TouchableOpacity
  style={styles.followButton}
  onPress={() =>
navigation.navigate('Carteira', {
  screen: 'InvestimentoDetails',
  params: {
    nome: title,
    empresa: description,
    precoAtual: parseFloat(price),
    variacao: parseFloat(growthValue),
    variacaoPercentual: parseFloat(growth),
    acoes,
    precoMedio,
    valorTotal,
    resultado,
    resultadoPercentual,
    chartData,
    logo
  }
})
  }
>
  <Text style={styles.followButtonText}>Acompanhe</Text>
</TouchableOpacity>


          </View>

        </View>
      </TouchableOpacity>
    );
  }

  // Compact view
  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.compactCard}>
      <View style={styles.compactContent}>
        <Image source={{ uri: logo }} style={styles.compactLogo} />
        <View style={styles.compactInfo}>
          <Text style={styles.compactTitle}>{title}</Text>
          <Text style={styles.compactDescription}>{description}</Text>
        </View>
        <View style={styles.compactRight}>
          <Text style={styles.compactPrice}>R$ {price}</Text>
          <Text style={[styles.compactGrowth, { color: isPositive ? '#00C851' : '#FF3B30' }]}>
            {isPositive ? 'Crescimento' : 'Queda'} de {growth} ou R$ {growthValue}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Compact card styles
  compactCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  compactLogo: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  compactInfo: {
    flex: 1,
  },
  compactTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  compactDescription: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  compactRight: {
    alignItems: 'flex-end',
  },
  compactPrice: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  compactGrowth: {
    fontSize: 10,
    marginTop: 2,
  },

  // Expanded card styles
  expandedCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 2,
    borderColor: '#362FFA',
    overflow: 'hidden',
  },
  expandedContent: {
    padding: 16,
  },
  expandedHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
  },
  expandedLogo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  expandedTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  expandedDescription: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  stockValue: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  stockPrice: {
    fontWeight: 'bold',
  },
  growthText: {
    color: '#00C851',
    fontSize: 14,
    marginBottom: 4,
  },
  afterGrowthText: {
    color: '#888',
    fontSize: 11,
  },
  afterGrowthValue: {
    color: '#00C851',
    fontWeight: 'bold',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  mainPrice: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainGrowth: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  investmentTip: {
    backgroundColor: '#2a2a2a',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#362FFA',
    maxWidth: 120,
  },
  tipText: {
    color: '#888',
    fontSize: 10,
    lineHeight: 12,
  },
  chartSection: {
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    height: 200,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
  },
  bottomGrowthText: {
    color: '#888',
    fontSize: 12,
    flex: 1,
  },
  bottomGrowthValue: {
    color: '#00C851',
    fontWeight: 'bold',
  },
  followButton: {
    backgroundColor: '#362FFA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  followButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  projectionBox: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 6,
    padding: 10,
  },
  projectionText: {
    color: '#888',
    fontSize: 11,
    lineHeight: 14,
  },
});

export default InvestmentCard;