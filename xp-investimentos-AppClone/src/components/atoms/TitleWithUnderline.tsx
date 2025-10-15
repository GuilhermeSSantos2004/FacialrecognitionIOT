import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TitleWithLineProps {
  title: string;
  fontSize?: number; // Opcional
}

const TitleWithLine: React.FC<TitleWithLineProps> = ({ title, fontSize = 24 }) => {
    const lineWidth = Math.min(300, title.length * fontSize * 0.65); // limite máximo para não exagerar

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize }]}>{title}</Text>
      <View style={[styles.line, { width: lineWidth }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    margin: 12,
  },
  title: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
line: {
  marginTop: 3,
  borderBottomWidth: 3,
  borderBottomColor: '#362FFA',
  paddingBottom: 4,
},

});

export default TitleWithLine;
