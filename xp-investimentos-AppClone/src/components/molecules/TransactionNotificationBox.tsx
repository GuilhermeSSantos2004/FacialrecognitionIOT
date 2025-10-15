import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Box from "../atoms/Box";

interface TransactionNotificationProps {
  type: "enviada" | "recebida";
  value: string;
  entityName: string;
  bankName: string;
  document: string;
}

const TransactionNotificationBox: React.FC<TransactionNotificationProps> = ({
  type,
  value,
  entityName,
  bankName,
  document,
}) => {
  const isReceived = type === "recebida";
  const titleText = `Transação ${isReceived ? "recebida" : "enviada"} de `;
  const directionText = isReceived ? `De ${entityName}` : `Para ${entityName}`;

  return (
    <Box>
      <Text style={styles.title}>
        {titleText}
        <Text style={styles.amount}>R${value}</Text>; {directionText}
      </Text>
      <Text style={styles.subtext}>
        Da instituição: {bankName}, CPF/CNPJ: {document}
      </Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 4,
  },
  amount: {
    color: "#362FFA",
    fontWeight: "bold",
  },
  subtext: {
    color: "#AAA",
    fontSize: 14,
  },
});

export default TransactionNotificationBox;
