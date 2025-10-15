import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import TitleWithLine from '../../atoms/TitleWithUnderline';
import Box from '../../atoms/Box';
import { RouteProp, useRoute } from '@react-navigation/native';
import { InvestimentoStackParamListType } from '../../../types/types';
import { SearchDados } from './mockDados';
import InvestmentList001 from '../../Educa-module/dynamic-components/Investment_list_001';
import InvestmentCard from '../../molecules/InvestimentCard';

type RouteType = RouteProp<InvestimentoStackParamListType, 'InvestimentoSearch'>;

const filtros = ['Todos', 'Ações', 'Criptomoedas', 'Imóveis', 'Commodities'];

const InvestmentSearchScreen = () => {
  const route = useRoute<RouteType>();
  const initialFilter = route.params?.initialFilter || 'Todos';
  console.log(initialFilter)
  const [searchText, setSearchText] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState(initialFilter);

  const investimentosFiltrados = useMemo(() => {
    return SearchDados.data.filter(item => {
      const correspondeFiltro =
        filtroAtivo === 'Todos' ||
        (filtroAtivo === 'Ações' && item.type === 'ação') ||
        (filtroAtivo === 'Criptomoedas' && item.type === 'cripto') ||
        (filtroAtivo === 'Imóveis' && item.type === 'imovel') ||
        (filtroAtivo === 'Commodities' && item.type === 'commodities');

      const correspondeBusca =
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase());

      return correspondeFiltro && correspondeBusca;
    });
  }, [searchText, filtroAtivo]);

 return (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.scrollContent}
    keyboardShouldPersistTaps="handled"
  >
    <TitleWithLine title="Buscar Investimentos" />

    <TextInput
      style={styles.input}
      placeholder="Buscar por símbolo ou nome..."
      placeholderTextColor="#999"
      value={searchText}
      onChangeText={setSearchText}
    />

    <View style={styles.filtrosRow}>
      {filtros.map((filtro) => (
        <TouchableOpacity
          key={filtro}
          style={[styles.filtroBotao, filtroAtivo === filtro && styles.filtroSelecionado]}
          onPress={() => setFiltroAtivo(filtro)}
        >
          <Text style={styles.filtroTexto}>{filtro}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <Box>
      <Text style={styles.subtitulo}>Todos os Investimentos</Text>
      {investimentosFiltrados.map((investment, index) => (
        <InvestmentCard key={`${investment.title}_${index}`} {...investment} />
      ))}
    </Box>
  </ScrollView>
);

};

export default InvestmentSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A1D',
  },
  scrollContent: {
  paddingBottom: 32,
},

  input: {
    backgroundColor: '#2D2F36',
    padding: 12,
    borderRadius: 8,
    color: '#FFF',
    fontSize: 14,
    marginBottom: 12,
  },
  filtrosRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
filtroBotao: {
  backgroundColor: '#2D2F36',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 16,
  marginRight: 8,
},

  filtroSelecionado: {
    backgroundColor: '#3F3DFF',
  },
  filtroTexto: {
    color: '#FFF',
    fontSize: 12,
  },
  subtitulo: {
    color: '#FFF',
    fontSize: 14,
    marginVertical: 8,
  },
});
