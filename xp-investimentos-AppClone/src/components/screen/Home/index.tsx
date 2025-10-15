import React from "react";
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from "react-native";
import DynamicRenderer from "../../Educa-module/DynamicRenderer";
import TitleWithLine from "../../atoms/TitleWithUnderline";
import InvestimentList from "../../organism/InvestimentList";
import { mockData } from "./mockFeed";

export const Home = () => {
  const handlers = {
    handleTesouroClick: (title: string) => {
      console.log("Clicou em Saiba mais sobre Tesouro Direto");
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <TitleWithLine title="Feed" />
        <View style={styles.infoContainer}>
          {mockData.map((item, index) => (
            <View key={`container_${index}`} style={styles.itemContainer}>
              <DynamicRenderer
                key={`${item.code}_${index}`}
                code={item.code}
                props={item.props}
              />
            </View>
          ))}
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
  contentContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    width: "100%",

    marginBottom: 16,
    overflow: "hidden",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#181A1D",
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
});
