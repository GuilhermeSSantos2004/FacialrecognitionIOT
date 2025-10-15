import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import TitleWithLine from "../../atoms/TitleWithUnderline";
import Box from "../../atoms/Box";

type ArticleDetailRouteParams = {
  EducaArticleDetail: {
    title: string;
    content: string;
    imageSource: any;
    source?: string;
  };
};

export default function ArticleDetail() {
  const route = useRoute<RouteProp<ArticleDetailRouteParams, "EducaArticleDetail">>();
  const { title, content, imageSource, source } = route.params;

  return (
    <ScrollView style={styles.scrollView}>
      <TitleWithLine title="Entenda" />
      <Box style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        {source && <Text style={styles.source}>Fonte: {source}</Text>}
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#181A1D",
  },

  card: {
    backgroundColor: "#0F0F10",
    borderRadius: 12,
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  content: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 22,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  source: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
      textAlign: "right",
  },
});
