import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Box from '../../atoms/Box';
import { RouteProp } from '@react-navigation/native';
import { InvestimentoStackParamListType } from '../../../types/types';
import TitleWithLine from '../../atoms/TitleWithUnderline';
import CandleStickChart from '../../atoms/CandleStickChart';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { useNavigation } from '@react-navigation/native';

type Props = {
  route: RouteProp<InvestimentoStackParamListType, 'InvestimentoDetails'>;
};


const InvestimentoDetailsScreen: React.FC<Props> = ({ route }) => {
  const {
    nome,
    empresa,
    precoAtual,
    variacao,
    variacaoPercentual,
    acoes,
    precoMedio,
    valorTotal,
    resultado,
    resultadoPercentual,
    chartData,
    logo

  } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<InvestimentoStackParamListType>>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Cabeçalho */}
      <TitleWithLine title={nome}/>

      {/* Preço atual */}
      <Box style={styles.card}>
        <Text style={styles.precoAtual}>  R$<Text style={styles.value}>{precoAtual.toFixed(2)}</Text></Text>
        <Text style={styles.variacao}>
          ↗ ${variacao.toFixed(2)} ({variacaoPercentual.toFixed(2)}%) hoje
        </Text>
      </Box>
<Box style={styles.card}>
  <TitleWithLine title="Desempenho"/>
  <CandleStickChart data={chartData} height={180} candleWidth={6} spacing={2} />
  <Box withBorder style={styles.card} width={"95%"} backgroundColor='#181A1D'>
  <Text style={styles.secao}>Como interpretar o gráfico?</Text>
  <Text style={styles.explicacao}>
    Cada vela representa a variação de preço de um período:
  </Text>
  <Text style={styles.lista}>
    • <Text style={styles.bold}>Open</Text>: Preço de abertura{'\n'}
    • <Text style={styles.bold}>Close</Text>: Preço de fechamento{'\n'}
    • <Text style={styles.bold}>High</Text>: Preço mais alto{'\n'}
    • <Text style={styles.bold}>Low</Text>: Preço mais baixo{'\n'}
  </Text>
  <Text style={styles.dica}>
    Dica: Se a vela estiver <Text style={{ color: '#4CAF50' }}>verde</Text>, o ativo valorizou.
    Se estiver <Text style={{ color: '#F44336' }}>vermelha</Text>, houve queda.
  </Text>
</Box>
</Box>
      {/* Sua Posição */}
      <Box style={styles.card}>
        <Text style={styles.secao}>Sua Posição</Text>

        <View style={styles.linha}>
          <View style={styles.coluna}>
            <Text style={styles.label}>Ações</Text>
            <Text style={styles.valor}>{acoes}</Text>
          </View>

          <View style={styles.coluna}>
            <Text style={styles.label}>Valor Total</Text>
            <Text style={styles.valor}>R$ {valorTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.linha}>
          <View style={styles.coluna}>
            <Text style={styles.label}>Preço Médio</Text>
            <Text style={styles.valor}>R$ {precoMedio.toFixed(2)}</Text>
          </View>

          <View style={styles.coluna}>
            <Text style={styles.label}>Resultado</Text>
            <Text style={[styles.valor, { color: resultado >= 0 ? '#4CAF50' : '#F44336' }]}>
              R$ {resultado.toFixed(2)} ({resultadoPercentual.toFixed(2)}%)
            </Text>
          </View>
        </View>
      </Box>

      {/* Botões */}
      <View style={styles.botoesRow}>
<TouchableOpacity
  style={[styles.botao, styles.botaoComprar]}
  onPress={() =>
    navigation.navigate('InvestimentoBuy', {
      nome,
      empresa,
      precoAtual,
      variacao,
      variacaoPercentual,
      acoes,
      precoMedio,
      valorTotal,
      resultado,
      resultadoPercentual,
      chartData,
      logo,
    })
  }
>
  <Text style={styles.textoBotao}>Comprar</Text>
</TouchableOpacity>


<TouchableOpacity
  style={[styles.botao, styles.botaoVender]}
  onPress={() =>
    navigation.navigate('InvestimentoSell', {
      nome,
      precoAtual,
      precoMedio,
      acoes, // ← necessário no types
      acoesDisponiveis: acoes, // opcional, se quiser diferenciar depois
    })
  }
>
  <Text style={styles.textoBotao}>Vender</Text>
</TouchableOpacity>

      </View>
    </ScrollView>
  );
};

export default InvestimentoDetailsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A1D',
  },
      value: {
    color: "#7C7C7C",
    fontWeight: "bold",
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
  },
  empresa: {
    fontSize: 14,
    color: '#CFCFCF',
    marginBottom: 16,
  },
  card: {
    marginVertical: 10,
  },
  precoAtual: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
  },
  variacao: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  secao: {
    color: '#CFCFCF',
    marginBottom: 10,
    fontSize: 14,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  coluna: {
    flex: 1,
  },
  label: {
    color: '#AAA',
    fontSize: 13,
  },
  valor: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  botoesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  botao: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10
  },
  botaoComprar: {
    backgroundColor: '#4CAF50',
  },
  botaoVender: {
    backgroundColor: '#F44336',
  },
  textoBotao: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  explicacao: {
  color: '#CFCFCF',
  fontSize: 13,
  marginBottom: 6,
},

lista: {
  color: '#FFF',
  fontSize: 13,
  lineHeight: 20,
},

bold: {
  fontWeight: 'bold',
},

dica: {
  color: '#AAA',
  fontSize: 12,
  marginTop: 10,
},

});
