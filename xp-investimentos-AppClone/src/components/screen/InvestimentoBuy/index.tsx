import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import Box from '../../atoms/Box';
import { CommonActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { InvestimentoStackParamListType } from '../../../types/types';
import TitleWithLine from '../../atoms/TitleWithUnderline';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InvestmentService } from '../../../service/investment/investment-service';
import { Toast } from 'toastify-react-native';

type RouteType = RouteProp<InvestimentoStackParamListType, 'InvestimentoBuy'>;
type NavigationType = NativeStackNavigationProp<InvestimentoStackParamListType>;

const formatCurrency = (value: string) => {
  const numeric = value.replace(/[^\d]/g, '');
  const float = parseFloat(numeric) / 100;
  return float.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const InvestimentoBuyScreen: React.FC = () => {
  const route = useRoute<RouteType>();
  const navigation = useNavigation<NavigationType>();
  
  const {
    nome,
    empresa,
    precoAtual,
    variacao,
    variacaoPercentual,
    chartData,
    logo
  } = route.params;

  const [tipoOrdem, setTipoOrdem] = useState<'mercado' | 'limitada'>('mercado');
  const [valorCompra, setValorCompra] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const saldoDisponivel = 15420.5;
  const investmentService = new InvestmentService();

  const handleValorChange = (text: string) => {
    const numeric = text.replace(/[^\d]/g, '');
    const formatted = formatCurrency(numeric);
    setValorCompra(formatted);
  };

  const handleConfirmarCompra = async () => {
    // Validação
    const numericValue = parseFloat(valorCompra.replace(/[^\d]/g, '')) / 100;
    if (!numericValue || numericValue > saldoDisponivel) {
      Alert.alert('Erro', 'Valor inválido ou saldo insuficiente.');
      return;
    }

    // Calcular quantidade de ações compradas
    const acoesCompradas = Math.floor(numericValue / precoAtual);
    if (acoesCompradas <= 0) {
      Alert.alert('Erro', 'O valor informado não permite comprar nenhuma ação.');
      return;
    }

    setLoading(true);

    try {
      // Criar investimento via API
      await investmentService.createInvestment({
        logo,
        title: nome,
        description: `${nome} | ${empresa}`,
        price: precoAtual,
        growth: variacao,
        growthValue: variacaoPercentual,
        acoes: acoesCompradas,
        precoMedio: precoAtual
      });

      setModalVisible(true);
      Toast.success('Compra realizada com sucesso!');

      setTimeout(() => {
        setModalVisible(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Investimento',
                params: { nuclearRefresh: Date.now() }
              },
            ],
          })
        );
      }, 2500);
    } catch (error: any) {
      console.error('Erro ao salvar investimento:', error);
      Alert.alert('Erro', error.message || 'Não foi possível realizar a compra. Tente novamente.');
      Toast.error(error.message || 'Erro ao realizar compra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TitleWithLine title={`Comprar ${nome}`} />

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

        <Text style={styles.label}>Valor da Compra (R$)</Text>
        <TextInput
          style={styles.input}
          placeholder="R$ 0,00"
          keyboardType="numeric"
          value={valorCompra}
          onChangeText={handleValorChange}
        />

        <Text style={styles.saldo}>
          Saldo disponível: <Text style={styles.saldoValor}>R$ {saldoDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
        </Text>
      </Box>

      <TouchableOpacity
        style={[styles.botaoConfirmar, loading && { opacity: 0.6 }]}
        onPress={handleConfirmarCompra}
        disabled={loading}
      >
        <Text style={styles.textoConfirmar}>
          {loading ? 'Processando...' : 'Confirmar Compra'}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Sucesso!</Text>
            <Text style={styles.modalText}>Compra realizada com sucesso!</Text>
            <Text style={styles.modalMotivation}>
              Você está no caminho certo! Cada investimento é um passo mais perto da sua liberdade financeira. Continue assim!
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InvestimentoBuyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A1D', padding: 16 },
  subtitulo: { color: '#999', fontSize: 14, marginBottom: 8 },
  card: { marginVertical: 10, padding: 16, borderRadius: 8 },
  precoAtual: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  label: { color: '#CCCCCC', fontSize: 13, marginVertical: 8 },
  ordemRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  botaoOrdem: { flex: 1, padding: 12, borderRadius: 6, backgroundColor: '#2D2F36', alignItems: 'center' },
  botaoSelecionado: { backgroundColor: '#3F3DFF' },
  botaoTexto: { color: '#FFFFFF', fontWeight: '600' },
  input: { backgroundColor: '#2D2F36', borderRadius: 6, padding: 12, color: '#FFFFFF', marginBottom: 16, fontSize: 16 },
  saldo: { color: '#999', fontSize: 12, textAlign: 'right' },
  saldoValor: { color: '#4CAF50', fontWeight: 'bold' },
  botaoConfirmar: { backgroundColor: '#2E7D32', padding: 16, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  textoConfirmar: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#222', padding: 32, borderRadius: 12, borderWidth: 1, borderColor: '#362FFA', width: '85%', alignItems: 'center' },
  modalTitle: { color: '#4CAF50', fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  modalText: { color: '#FFF', fontSize: 16, marginBottom: 12 },
  modalMotivation: { color: '#999', fontSize: 14, textAlign: 'center', fontStyle: 'italic' },
});
