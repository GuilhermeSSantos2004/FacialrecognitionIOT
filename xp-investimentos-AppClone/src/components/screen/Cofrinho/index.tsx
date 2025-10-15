import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import Box from "../../atoms/Box";
import TitleWithLine from "../../atoms/TitleWithUnderline";
import BalanceBox from "../../molecules/BalanceBox";
import Notifications from "../../organism/Notifications";
import GoalsSection from "../../molecules/GoalsSection";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CofrinhoParamList } from "../../../types/types"; 
import { Ionicons } from "@expo/vector-icons";
import { useCache } from "../../../service/useCache";
import { getCachedPiggyBanks, getCachedInvestments, PiggyBank } from "../../../service/cacheService";

export const Cofrinho = () => {
  const { piggyBanks, piggyTransfers, loading, initializeData, refreshCache } = useCache();

  // estado local para armazenar cache
  const cachedPiggyBanks= piggyBanks;
  const navigation = useNavigation<NativeStackNavigationProp<CofrinhoParamList>>();
  useEffect(() => {
  }, [piggyBanks]);
  useEffect(() => {
    const loadCache = async () => {
      const cached = await getCachedPiggyBanks();
      if (cached) {
      }
      if (!loading) {
        initializeData();
      }
    };

    loadCache();
  }, []);

  // sempre prefere o cache local, se existir
  const localPiggyBanks = cachedPiggyBanks.length > 0 ? cachedPiggyBanks : (piggyBanks || []);
  const localPiggyTransfers = piggyTransfers || [];

  let WINDOW_WIDTH = Dimensions.get("window").width;
  const CARD_MARGIN = 16;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <TitleWithLine title="Cofrinhos" />

      <BalanceBox
        title="Total nas caixinhas"
        value={localPiggyBanks.reduce((total, c) => total + c.valor, 0)}
        showValue={true}
      />

      <View style={{ marginVertical: 20 }}>
        <TitleWithLine title="Seus Cofrinhos"/>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10, paddingLeft: 16 }}
        >
          {localPiggyBanks.map((cofrinho) => (
            <Box
              key={cofrinho.id}
              withBorder
              width={WINDOW_WIDTH * 0.65}
            >
              <Image source={{ uri: cofrinho.imagem }} style={styles.cardImage} />
              <View style={styles.content}>
                <Text style={styles.title}>{cofrinho.nome}</Text>
                <Text style={styles.amount}>R$ {cofrinho.valor.toFixed(2)}</Text>
                <Text style={styles.growth}>Crescimento de %0,12 ou R$00.01</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate("CofrinhoDetails", {
                      objetivo: cofrinho.nome,
                      saldoAtual: cofrinho.valor,
                      mostrarSaldo: true,
                      meta: cofrinho.meta,
                      progresso: cofrinho.progresso,
                      descricaoMeta: cofrinho.descricaoMeta,
                      dadosGrafico: cofrinho.dadosGrafico,
                      labelsGrafico: cofrinho.labelsGrafico,
                      resumo: cofrinho.resumo,
                    })
                  }
                >
                  <Text style={styles.buttonText}>Ver</Text>
                </TouchableOpacity>
              </View>
            </Box>
          ))}

          <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
            <Box withBorder style={styles.addCard} width={WINDOW_WIDTH * 0.65} height={335}>
              <Ionicons name="add" size={48} color="#fff" />
            </Box>
          </TouchableOpacity>

          <View style={{ width: CARD_MARGIN }} />
        </ScrollView>
      </View>

      <GoalsSection
        title="Metas"
        chartData={[1000, 2500, 3500, 4800, 5800, 7000, 8000]}
        chartLabels={["jan", "fev", "mar", "abr", "mai", "jun", "jul"]}
        message="Você já acumulou R$8.000,00 na sua reserva de emergência, o que representa 66% da sua meta de R$12.000,00. Excelente progresso!"
        goalName="Reserva de Emergência"
        currentAmount={8000}
        goalAmount={12000}
        goalImage={{ uri: "https://images.pexels.com/photos/3943724/pexels-photo-3943724.jpeg" }}
      />

      <Notifications piggyData={localPiggyTransfers} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A1D",
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 0,
  },
  nameBox: {
    backgroundColor: "#362FFA",
    color: "#ffffff",
    width: "100%",
    padding: 20,
    marginBottom: 25,
    verticalAlign: "middle",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 30,
    marginVertical: 20,
  },
  item: {
    alignItems: "center",
  },
  iconBox: {
    backgroundColor: "#1A1B1F",
    borderWidth: 1.5,
    borderColor: "#362FFA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 6,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  contentContainer: {
    justifyContent: "center",
    paddingBottom: 20,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  content: {
    padding: 10,
    justifyContent: "flex-start",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  amount: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 4,
  },
  growth: {
    color: "green",
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#362FFA",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  addCard: {
    justifyContent: "center",
    alignItems: "center",
  },
});