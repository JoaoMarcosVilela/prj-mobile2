import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

import Header from '../../components/Header';
import Balanco from '../../components/Balanco';
import ListaMovimentacao from '../../components/ListaMovimentacao';
import Acoes from '../../components/Acoes';

const list = [
  {
    id: 1,
    idUsuario: 1,
    titulo: 'Salario prefeitura',
    valor: '5000,00',
    data: '05/01/2025',
    tipo: 0 // RECEITA
  },
]



export default function Home() {
  const route = useRoute();
  const { usuario, id } = route.params;


  return (
    <View style={styles.container}>

      <Header usuario={usuario}/>

      <Balanco idUsuario={id}/>

      <Acoes idUsuario={id} usuarioName={usuario}/>

      <ListaMovimentacao idUsuario={id} usuario={usuario}/>

      <StatusBar style="auto" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginStart: '5%',
    marginEnd: '5%',
    marginTop: '5%'
  },
  esconder:{
    backgroundColor: '#dadada'
  }
});