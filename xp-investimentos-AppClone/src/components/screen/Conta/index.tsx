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
import { useCache } from "../../../service/useCache";

export const Conta = () => {
  const { articles, notifications, loading, initializeData } = useCache();
  const [localArticles, setLocalArticles] = useState<any[]>([]);
  const [localNotifications, setLocalNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Carregar dados do cache quando o componente montar
    if ((!articles || articles.length === 0) && !loading) {
      initializeData();
    } else {
      setLocalArticles(articles || []);
      setLocalNotifications(notifications || []);
    }
  }, [articles, notifications, loading]);

  let WINDOW_WIDTH = Dimensions.get("window").width;
  const CARD_MARGIN = 16;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.nameBox}>
        <Text style={{ color: "#ffffff", fontSize: 20, marginTop: 30 }}>
          Bem Vindo ADMIN
        </Text>
      </View>
      <TitleWithLine title="Conta" />
      <BalanceBox title="Saldo" value={30.32} showValue={true} />
      <View style={{marginVertical: 20}}></View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="start"
        alwaysBounceHorizontal={true}
      >
        {localArticles.map((article, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={article.imageSource}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
        <View style={{ width: CARD_MARGIN }} />
      </ScrollView>

      <Notifications data={localNotifications} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A1D",
  },
  card: {
    width: Dimensions.get("window").width * 0.3,
    height: 200,
    borderWidth: 2,
    borderColor: "#362FFA",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  nameBox: {
    backgroundColor: "#362FFA",
    color: "#ffffff",
    width: "100%",
    padding: 20,
    marginBottom: 25,
    verticalAlign: "middle",
  },
  contentContainer: {
    paddingBottom: 20,
  },
});