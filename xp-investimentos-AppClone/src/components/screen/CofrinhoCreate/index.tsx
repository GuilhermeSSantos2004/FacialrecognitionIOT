import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Box from "../../atoms/Box";
import TitleWithLine from "../../atoms/TitleWithUnderline";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { CofrinhoParamList } from "../../../types/types";
import { PiggyBankService } from "../../../service/piggyBank/piggyBank-service";
import { Toast } from "toastify-react-native";

export default function CofrinhoCreate() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [boxType, setBoxType] = useState("100");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<CofrinhoParamList>>();
  const piggyBankService = new PiggyBankService();

  const images = [
    "https://img.odcdn.com.br/wp-content/uploads/2023/01/Destaque-celular-novo.jpg",
    "https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg",
    "https://images.pexels.com/photos/3943724/pexels-photo-3943724.jpeg",
    "https://veja.abril.com.br/wp-content/uploads/2016/09/turismo-mala-viagem-20160905-03.jpg?quality=70&strip=info&resize=1080,565&crop=1",
  ];

  const handleSave = async () => {
    if (!name.trim() || !goal.trim() || !selectedImage) {
      Alert.alert("Erro", "Por favor, preencha todos os campos e selecione uma imagem");
      return;
    }

    const metaValue = parseFloat(goal.replace(/[^\d,]/g, '').replace(',', '.'));

    if (isNaN(metaValue) || metaValue <= 0) {
      Alert.alert("Erro", "Por favor, insira um valor válido para a meta");
      return;
    }

    setLoading(true);

    try {
      // Criar cofrinho via API
      await piggyBankService.createPiggyBank({
        nome: name.trim(),
        meta: metaValue,
        imagem: selectedImage,
        tipo: boxType
      });

      Toast.success("Cofrinho criado com sucesso!");
      Alert.alert("Sucesso", "Cofrinho criado com sucesso!");

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Cofre',
              params: { nuclearRefresh: Date.now() }
            },
          ],
        })
      );
    } catch (error: any) {
      console.error("Erro ao salvar cofrinho:", error);
      Alert.alert("Erro", error.message || "Não foi possível criar o cofrinho. Tente novamente.");
      Toast.error(error.message || "Erro ao criar cofrinho");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    let numericValue = value.replace(/[^\d]/g, '');
    
    if (numericValue) {
      const numberValue = parseFloat(numericValue) / 100;
      return numberValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      });
    }
    return '';
  };

  const handleGoalChange = (text: string) => {
    const numericText = text.replace(/[^\d]/g, '');
    setGoal(numericText);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <TitleWithLine title="Novo cofrinho"/>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          placeholder="Ex: Primeiro carro"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Meta</Text>
        <TextInput
          placeholder="R$ 0,00"
          placeholderTextColor="#888"
          value={formatCurrency(goal)}
          onChangeText={handleGoalChange}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Sonho</Text>
        <View style={styles.imageGrid}>
          {images.map((uri, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImage(uri)}
              style={[
                styles.imageWrapper,
                selectedImage === uri && styles.selectedImage,
              ]}
            >
              <Image source={{ uri }} style={styles.image} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.imageWrapper}>
            <Text style={styles.addImage}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Tipo de caixinha</Text>
        <View style={styles.radioGroup}>
          {[
            { label: "Rendimento 100%", value: "100" },
            { label: "Rendimento 101% - trava 6 meses", value: "101_6" },
            { label: "Rendimento 102% - trava 12 meses", value: "102_12" },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.radioOption}
              onPress={() => setBoxType(option.value)}
            >
              <Box width={"100%"} withBorder backgroundColor="#181A1D">
                <View style={styles.radialCard}>
                  <Text style={styles.radioLabel}>{option.label}</Text>
                  <View style={[styles.radioCircle, boxType === option.value && styles.radioSelected]} />
                </View>
              </Box>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#181A1D",
    padding: 16,
  },
  radialCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  radioGroup: {
    marginBottom: 24,
  },
  radioOption: {
    marginBottom: 12,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4D6FFF",
  },
  radioSelected: {
    backgroundColor: "#4D6FFF",
  },
  radioLabel: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#0F0F10",
    borderRadius: 12,
    padding: 16,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#2A2B2E",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  imageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  selectedImage: {
    borderWidth: 3,
    borderColor: "#4D6FFF",
  },
  addImage: {
    fontSize: 28,
    color: "#aaa",
  },
  saveButton: {
    backgroundColor: "#362FFA",
    paddingVertical: 16,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});