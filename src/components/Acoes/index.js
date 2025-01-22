import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import { useNavigation } from "@react-navigation/native";

export default function Acoes({idUsuario, usuarioName}) {


    const navigation = useNavigation();

    return (
        <ScrollView style={styles.container} horizontal={true} showsHorizontalScrollIndicator={false}>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('CadastroMovimentacao', {idUsuario: idUsuario, usuario: usuarioName})}>

                <View style={styles.areaButton}>
                    <AntDesign name='addfolder' size={26} color={'#000'} />
                </View>
                <Text style={styles.textoButton}>Entradas</Text>

            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Login')}>

                <View style={styles.areaButton}>
                    <MaterialCommunityIcons name='exit-to-app' size={26} color={'#000'} />
                </View>
                <Text style={styles.textoButton}>Sair</Text>

            </TouchableOpacity>


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 84,
        marginBottom: '5%',
        marginTop: '5%',
        paddingStart: '5%',
        paddingEnd: '5%'
    },
    actionButton: {
        alignItems: 'center',
        marginRight: '50%'

    },
    areaButton: {
        backgroundColor: '#ecf0f1',
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textoButton: {
        marginTop: 7,
        textAlign: 'center',
        fontWeight: 'bold'
    }
})