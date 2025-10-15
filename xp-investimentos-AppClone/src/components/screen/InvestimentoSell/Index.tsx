import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InvestimentoStackParamListType } from '../../../types/types';
import Box from '../../atoms/Box';
import TitleWithLine from '../../atoms/TitleWithUnderline';

// Tipagem

type RouteType = RouteProp<InvestimentoStackParamListType, 'InvestimentoSell'>;
type NavigationType = NativeStackNavigationProp<InvestimentoStackParamListType>;

const InvestimentoSellScreen: React.FC = () => {
  const route = useRoute<RouteType>();
  const navigation = useNavigation<NavigationType>();
  const { nome, precoAtual, precoMedio, acoes } = route.params;

  const [tipoOrdem, setTipoOrdem] = useState<'mercado' | 'limitada'>('mercado');
  const [quantidade, setQuantidade] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSetPercent = (percent: number) => {
    const result = Math.floor(acoes * percent);
    setQuantidade(String(result));
  };

  const handleQuantidadeChange = (text: string) => {
    const numericOnly = text.replace(/[^0-9]/g, '');
    if (parseInt(numericOnly) > acoes) {
      setQuantidade(String(acoes));
    } else {
      setQuantidade(numericOnly);
    }
  };

  const parsedQuantidade = parseInt(quantidade) || 0;
  const totalReceber = parsedQuantidade * precoAtual;

  const handleConfirmarVenda = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate('Investimento');
    }, 2500);
  };

  return (
    <View style={styles.container}>
      <TitleWithLine title={`Vender ${nome}`} />

      <Box style={styles.card} width={'95%'}>
        <Text style={styles.subtitulo}>Preço Atual</Text>
        <Text style={styles.precoAtual}>R$ {precoAtual.toFixed(2).replace('.', ',')}</Text>
      </Box>

      <Box style={styles.card} width={'95%'}>
        <Text style={styles.label}>Tipo de Ordem</Text>
        <View style={styles.ordemRow}>
          <TouchableOpacity
            style={[styles.botaoOrdem, tipoOrdem === 'mercado' && styles.botaoSelecionado]}
            onPress={() => setTipoOrdem('mercado')}
          >
            <Text style={styles.botaoTexto}>Mercado</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.botaoOrdem, tipoOrdem === 'limitada' && styles.botaoSelecionado]}
            onPress={() => setTipoOrdem('limitada')}
          >
            <Text style={styles.botaoTexto}>Limitada</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Quantidade de Ações</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          keyboardType="numeric"
          value={quantidade}
          onChangeText={handleQuantidadeChange}
        />

        <View style={styles.percentRow}>
          {[0.25, 0.5, 0.75, 1].map(p => (
            <TouchableOpacity key={p} onPress={() => handleSetPercent(p)}>
              <Text style={styles.percentText}>{p * 100}%</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Ações disponíveis: <Text style={styles.valorInfo}>{acoes}</Text></Text>
          <Text style={styles.infoText}>Preço médio: <Text style={styles.valorInfo}>R$ {precoMedio.toFixed(2).replace('.', ',')}</Text></Text>
          <Text style={styles.infoText}>Total a receber: <Text style={styles.valorInfo}>R$ {totalReceber.toFixed(2).replace('.', ',')}</Text></Text>
        </View>
      </Box>

      <TouchableOpacity
        style={[styles.botaoConfirmar, parsedQuantidade === 0 && { opacity: 0.5 }]}
        onPress={handleConfirmarVenda}
        disabled={parsedQuantidade === 0}
      >
        <Text style={styles.textoConfirmar}>Confirmar Venda</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Venda Concluída</Text>
            <Text style={styles.modalText}>Parabéns! Você está gerenciando bem seus ativos.</Text>
            <Text style={styles.modalMotivation}>
              "Cada escolha inteligente te aproxima do seu futuro financeiro!
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InvestimentoSellScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A1D',
    padding: 16,
  },
  subtitulo: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
  },
  card: {
    marginVertical: 10,
    padding: 16,
    borderRadius: 8,
  },
  precoAtual: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  label: {
    color: '#CCCCCC',
    fontSize: 13,
    marginVertical: 8,
  },
  ordemRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  botaoOrdem: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#2D2F36',
    alignItems: 'center',
  },
  botaoSelecionado: {
    backgroundColor: '#3F3DFF',
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#2D2F36',
    borderRadius: 6,
    padding: 12,
    color: '#FFFFFF',
    marginBottom: 12,
    fontSize: 16,
  },
  percentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  percentText: {
    color: '#3F3DFF',
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#2D2F36',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  infoText: {
    color: '#999',
    fontSize: 13,
    marginBottom: 4,
  },
  valorInfo: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  botaoConfirmar: {
    backgroundColor: '#C62828',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  textoConfirmar: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#222',
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#362FFA',
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#C62828',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 12,
  },
  modalMotivation: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
