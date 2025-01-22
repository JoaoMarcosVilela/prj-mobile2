import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function PlusButtom() {
  const navigate = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttom} onPress={() => navigate.navigate('CadastroMovimentacao')}>
        <Feather name="plus-circle" size={50} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttom: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
    marginBottom: '10%',
  },
});
