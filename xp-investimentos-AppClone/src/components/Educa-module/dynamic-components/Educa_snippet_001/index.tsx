import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Box from '../../../atoms/Box';
import TitleWithLine from '../../../atoms/TitleWithUnderline';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { FeedStackParamList } from '../../../../types/types';
import { useNavigation } from '@react-navigation/native';


interface InfoBoxProps {
  title: string;
  subtitle: string;
  content: string; // Conteúdo completo vai para a tela de detalhes
  imageSource: any;
  source?: string;
}

const EducaSnippet001: React.FC<InfoBoxProps> = ({
  title,
  subtitle,
  content,
  imageSource,
  source
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackParamList>>();

  const handleSeeMore = () => {
    navigation.navigate('EducaArticleDetail', {
      title,
      content,
      imageSource,
      source,
    } as never);
  };

  return (
    <Box withBorder={false}>
          <TitleWithLine title={title}/>
      <View style={styles.container}>
        <View style={styles.leftContent}>
          <Text style={styles.contentText}>{subtitle}</Text>
        </View>
        <View style={styles.rightContent}>
          <Image 
            source={imageSource} 
            style={styles.image} 
            resizeMode="contain"
          />
        </View>
      </View>
    <TouchableOpacity style={styles.seeMoreContainer} onPress={handleSeeMore}>
        <Text style={styles.seeMoreText}>Ver mais</Text>
      </TouchableOpacity>
    </Box>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
    paddingRight: 10,
  },
  rightContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    color: '#ffffff',
    marginTop: 12,
    fontSize: 13,
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  seeMoreContainer: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  seeMoreText: {
    color: '#362FFA',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default EducaSnippet001;