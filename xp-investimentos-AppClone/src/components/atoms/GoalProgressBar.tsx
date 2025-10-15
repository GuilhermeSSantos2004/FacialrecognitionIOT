import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GoalProgressBarProps {
  current: number;
  total: number;
}

const GoalProgressBar: React.FC<GoalProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <View>
      <Text style={styles.progressText}>
        R${current.toFixed(2)} / R${total.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBackground: {
    height: 6,
    backgroundColor: '#2F2F2F',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#3F3DFF',
  },
  progressText: {
    marginTop: 4,
    color: '#fff',
    fontSize: 12,
    textAlign: 'right',
  },
});

export default GoalProgressBar;
