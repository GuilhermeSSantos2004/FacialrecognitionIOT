import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Box from "../atoms/Box"; // ajuste o caminho conforme sua estrutura

interface BalanceBoxProps {
  title: string;
  value: number;
  showValue?: boolean;
}

const BalanceBox: React.FC<BalanceBoxProps> = ({ title, value, showValue = true }) => {
  return (
    <Box>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.balanceRow}>
        <Text style={styles.currency}>R$</Text>
        <Text style={styles.value}>
          {showValue ? value.toFixed(2).replace('.', ',') : "••••••"}
        </Text>
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: "#7C7C7C",
    marginBottom: 8,
    fontWeight: "500",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currency: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginRight: 4,
  },
  value: {
    fontSize: 20,
    color: "#7C7C7C",
    fontWeight: "bold",
  },
});

export default BalanceBox;
