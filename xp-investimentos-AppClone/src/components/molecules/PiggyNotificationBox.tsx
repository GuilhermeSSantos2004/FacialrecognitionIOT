import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Box from "../atoms/Box";

interface PiggyNotificationBoxProps {
  type: "transferido" | "retirado";
  value: string;
  piggyName: string;
}

const PiggyNotificationBox: React.FC<PiggyNotificationBoxProps> = ({
  type,
  value,
  piggyName,
}) => {
  const isTransfer = type === "transferido";
  const prefixText = isTransfer ? "Transferido" : "Retirado";
  const actionText = isTransfer
    ? `para caixinha “${piggyName}”`
    : `da caixinha “${piggyName}”`;

  return (
    <Box>
      <Text style={styles.text}>
        {prefixText}{" "}
        <Text style={styles.amount}>R${value}</Text> reais {actionText}
      </Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#FFF",
    fontSize: 15,
  },
  amount: {
    color: "#362FFA",
    fontWeight: "bold",
  },
});

export default PiggyNotificationBox;
