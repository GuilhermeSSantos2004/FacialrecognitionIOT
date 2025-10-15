import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import TitleWithUnderline from "../atoms/TitleWithUnderline";
import Box from "../atoms/Box";
import GoalsChart from "../atoms/GoalChart";
import GoalProgressBar from "../atoms/GoalProgressBar";

interface GoalsSectionProps {
  title: string;
  chartData: number[]; // Ex: [100, 200, 400, 300]
  chartLabels?: string[]; // NOVO: nomes dos meses ou categorias para o gráfico
  message: string;
  goalName: string;
  goalAmount: number;
  currentAmount: number;
  goalImage: any; // Pode ser um require(...) ou uma URI
}

const GoalsSection: React.FC<GoalsSectionProps> = ({
  title,
  chartData,
  chartLabels = [],
  message,
  goalName,
  goalAmount,
  currentAmount,
  goalImage,
}) => {
  return (
    <Box >
      <View style={styles.container}>
        <TitleWithUnderline title={title} />
        <GoalsChart data={chartData} labels={chartLabels} />

        <Box withBorder width={"auto"} backgroundColor="#181A1D">
          <Text style={styles.messageText}>{message}</Text>
        </Box>

        <Box withBorder width={"auto"}>
          <View style={styles.goalInfo}>
            <View style={styles.goalDetails}>
              <Image source={goalImage} style={styles.goalImage} />
              <Text style={styles.goalTitle}>{goalName}</Text>
            </View>
            <Text style={styles.goalValue}>
              {currentAmount} / {goalAmount}
            </Text>
          </View>
        </Box>
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  messageText: {
    color: "#fff",
    fontSize: 11,
  },
  goalInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  goalDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  goalValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  goalImage: {
    width: 50,
    height: 30,
    borderRadius: 4,
    resizeMode: "contain",
  },
  goalTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default GoalsSection;
