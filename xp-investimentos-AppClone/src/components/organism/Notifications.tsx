import React from "react";
import { View, StyleSheet } from "react-native";
import NotificationBox from "../molecules/TransactionNotificationBox";
import TitleWithUnderline from "../atoms/TitleWithUnderline";

interface NotificationData {
  type: "recebida" | "enviada";
  value: string;
  entity: string;
  bank: string;
  document: string;
}
interface PiggyNotificationData {
  type: "transferido" | "retirado";
  value: string;
  piggyName: string;
}

interface NotificationsProps {
  data?: NotificationData[];
  piggyData?: PiggyNotificationData[];

}
import PiggyNotificationBox from "../molecules/PiggyNotificationBox";

const Notifications: React.FC<NotificationsProps> = ({ data, piggyData }) => {
  return (
    <View>
{data && data.length > 0 && (
  <>
    <TitleWithUnderline title="Notificações de Transações" />
    {data.map((item, index) => (
      <View key={`trans-${index}`} style={styles.notificationWrapper}>
        <NotificationBox
          type={item.type}
          value={item.value}
          entityName={item.entity}
          bankName={item.bank}
          document={item.document}
        />
      </View>
    ))}
  </>
)}

      {piggyData && piggyData.length > 0 && (
        <>
          <TitleWithUnderline title="Notificações nas Caixinhas" />
          {piggyData.map((item, index) => (
            <View key={`piggy-${index}`} style={styles.notificationWrapper}>
              <PiggyNotificationBox
                type={item.type}
                value={item.value}
                piggyName={item.piggyName}
              />
            </View>
          ))}
        </>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  notificationWrapper: {
    marginBottom: 12, // aqui define o "gap"
  },
});

export default Notifications;
