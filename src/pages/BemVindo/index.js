import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import * as Animatable from 'react-native-animatable'

import { useNavigation } from '@react-navigation/native';

export default function BemVindo() {

  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation='flipInY'
          source={require('../../../assets/img/BemVindo.png')}
          style={{ width: '250', height: '250'}}
          resizeMode='contain'
        />
      </View>
      
      <Animatable.View delay={700} animation='fadeInUp' style={styles.containerForm}>
        <Text style={styles.title}>Seu app, para organizar seus gastos!</Text>
        <Text style={styles.text}>Faça o login para começar</Text>

        <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>

      </Animatable.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#8000FF'

  },
  containerLogo:{
    height: 500,
    //backgroundColor: 'red',
    alignItems:'center',
    justifyContent: 'center'
  },
  containerForm:{
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%'
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 12,
  },
  text:{
    color: '#a1a1a1'
  },
  button:{
    position: 'absolute',
    backgroundColor: '#8000FF',
    borderRadius: 50,
    paddingVertical: 8,
    width: '60%',
    alignSelf: 'center',
    bottom: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText:{
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold'
  }
})