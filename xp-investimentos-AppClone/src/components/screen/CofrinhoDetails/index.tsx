import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, useWindowDimensions } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { CofrinhoParamList } from "../../../types/types";
import Box from "../../atoms/Box";
import GoalsChart from "../../atoms/GoalChart";
import TitleWithLine from "../../atoms/TitleWithUnderline";
import BalanceBox from "../../molecules/BalanceBox";


type Props = {
  route: RouteProp<CofrinhoParamList, "CofrinhoDetails">;
};

const CofrinhoDetailsScreen: React.FC<Props> = ({ route }) => {
  const {
    objetivo,
    saldoAtual,
    mostrarSaldo,
    meta,
    progresso,
    descricaoMeta,
    dadosGrafico,
    labelsGrafico,
    resumo,
  } = route.params;
  const { width: screenWidth } = useWindowDimensions();

  const barWidth = screenWidth - 40; // margem de segurança

const safeProgress = Math.max(
  0,
  Math.min(1, isNaN(Number(progresso)) ? 0 : Number(progresso))
);
  return (
     <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
    <View style={styles.container}>
      <TitleWithLine title={objetivo} fontSize={22} />

<View style={styles.infoContainer}>
      <BalanceBox title={objetivo} value={saldoAtual} showValue={mostrarSaldo} />
</View>
<View style={styles.infoContainer}>
<Box>
      <TitleWithLine title="meta" />
  <View style={styles.metaContent}>
    {/* Lado esquerdo: Título "Meta" */}
    <View style={styles.metaLeft}>
      <Text style={styles.metaValor}>
        R$ {meta.toFixed(2).replace(".", ",")}
      </Text>
    </View>

    {/* Lado direito: Valor da meta + descrição */}
    <Box style={styles.metaRight} withBorder >
      <Text style={styles.metaDescricao}>{descricaoMeta}</Text>
    </Box>
  </View>

  {/* Barra de progresso abaixo */}
<View style={[styles.progressBar, { width: barWidth }]}>
  <View style={[styles.progressFill, { width: barWidth * safeProgress }]}>
    <Text style={styles.progressText}>{(safeProgress * 100).toFixed(0)}%</Text>
  </View>
</View>
</Box>
</View>
<View style={styles.infoContainer}>
 <Box>
  <TitleWithLine title="Performance"/>

  <GoalsChart data={dadosGrafico} labels={labelsGrafico} />

  <View style={styles.resumo}>
    <Box withBorder style={styles.resumoBox} width={"100%"}>
      <Text style={styles.resumoItem}>Saldo inicial: R$ {resumo.saldoInicial.toFixed(2)}</Text>
    </Box>

    <Box withBorder style={styles.resumoBox}  width={"100%"}>
      <Text style={styles.resumoItem}>Entradas: + R$ {resumo.entradas.toFixed(2)}</Text>
    </Box>

    <Box withBorder style={styles.resumoBox}  width={"100%"}>
      <Text style={styles.resumoItem}>Saídas: - R$ {resumo.saidas.toFixed(2)}</Text>
    </Box>

    <Box withBorder style={styles.resumoBox}  width={"100%"}>
      <Text style={styles.resumoItem}>Diferença: R$ {resumo.diferenca.toFixed(2)}</Text>
    </Box>
  </View>
</Box>
</View>

    </View>
</ScrollView>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A1D",
  },
  safeArea: {
  flex: 1,
  backgroundColor: "#181A1D",
},
scrollContent: {
  paddingBottom: 30,
},
    infoContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 16,
  },
  icon: {
    fontSize: 20,
    textAlign: "center",
    color: "#362FFA",
  },
  actionText: {
    fontSize: 12,
    textAlign: "center",
    color: "#FFF",
    marginTop: 4,
  },
  resumoBox: {
  paddingVertical: 10,
},
  metaTitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  metaValor: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  metaDescricao: {
    color: "#CFCFCF",
  },
  progressBar: {
    height: 30,
    backgroundColor: "#2A2A2A",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3F3DFF",
  },
  resumo: {
    marginTop: 12,
  },
  resumoItem: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 4,
  },
metaContent: {
  flexDirection: "row",
  alignItems: "center", // Alinha verticalmente os dois lados
  gap: 10,
  marginBottom: 12,
  minHeight: 80, // altura mínima para garantir alinhamento
},

  metaLeft: {
    flex: 3,
      justifyContent: "center", // centraliza verticalmente

  },
  metaRight: {
    flex: 2,
    alignItems: "flex-end",
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default CofrinhoDetailsScreen;
