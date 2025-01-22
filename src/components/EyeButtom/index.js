import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function EyeButtom({estado, mudarValor}) {


 return (

    <View style={styles.container}>
        <TouchableOpacity style={styles.buttom} onPress={mudarValor}>
            <Feather name={estado ? 'eye-off' : 'eye'} size={25}/>
        </TouchableOpacity>
    </View>
   
  );
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttom:{
        marginEnd: '8%',
        marginBottom: '2%'
    }
})