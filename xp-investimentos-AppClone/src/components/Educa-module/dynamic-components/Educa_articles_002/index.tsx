import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Box from '../../../atoms/Box';
import TitleWithLine from '../../../atoms/TitleWithUnderline';

interface Article {
  title: string;
  content: string;
  imageSource: any;
}

interface ArticleCarouselProps {
  sectionTitle: string;
  articles: Article[];
}

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = WINDOW_WIDTH -50;


const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_MARGIN * 2;

const ArticleCard: React.FC<Article> = ({ title, content, imageSource }) => (
  <View style={styles.cardContainer}>
    <Box withBorder width={WINDOW_WIDTH * 0.85}>
      <Image 
        source={imageSource} 
        style={styles.cardImage} 
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardContent} numberOfLines={3} ellipsizeMode="tail">
          {content}
        </Text>
      </View>
    </Box>
  </View>
);

const EducaArticle002: React.FC<ArticleCarouselProps> = ({ sectionTitle, articles }) => {
  return (
    <View style={{padding: 10}}>
      <TitleWithLine title={sectionTitle} />
      
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  snapToInterval={WINDOW_WIDTH}
  decelerationRate="fast"
  snapToAlignment="start"
  alwaysBounceHorizontal= {true}
  
>

  {articles.map((article, index) => (
    <ArticleCard key={index} {...article} />
  ))}
  <View style={{ width: CARD_MARGIN }} />
</ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({

scrollContent: {
  flexDirection: 'row',
  alignItems: 'flex-start', // ou 'stretch' se quiser preencher verticalmente
  
},

  cardWrapper: {
    marginHorizontal: CARD_MARGIN,
  },
  cardContainer: {
    width: WINDOW_WIDTH-5,
    alignItems: "center",
  resizeMode: "contain"  
},

  cardImage: {
    width: '100%',
    height: 180, // Taller image
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 0,
  },
  textContainer: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 20,
  },
});

export default EducaArticle002;