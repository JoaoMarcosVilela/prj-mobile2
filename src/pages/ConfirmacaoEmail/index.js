import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ConfirmacaoEmail() {
  const navigate = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificação de E-mail</Text>

      <Text style={styles.text}>
        Um email de verificação foi enviado para você. Por favor, verifique sua
        caixa de entrada e clique no link de verificação.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigate.navigate('Login')} // Redireciona para o Login após confirmação
      >
        <Text style={styles.buttonText}>Voltar para o Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8000FF",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#8000FF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
