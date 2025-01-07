import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";

export default function Cadastro(){

    const navigate = useNavigation()
    
    return(

        <View style={styles.container}>
            
            <View style={styles.containerHeader}>
                <Text style={styles.boasVindas}>Cadastro</Text>
            </View>

            <View style={styles.containerForm}>
                <Text style={styles.title}>Email</Text>
                <TextInput 
                    placeholder="Digite seu email"
                    style={styles.input}
                />
                
                <Text style={styles.title}>Senha</Text>
                <TextInput 
                    placeholder="Digite sua senha"
                    style={styles.input}
                />
                
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                style={styles.buttonRegister}
                onPress={() => navigate.navigate('Login')}
                >
                    <Text style={styles.registerText}>Voltar</Text>
                </TouchableOpacity>
            </View>


        </View>

    )

}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#8000FF'
    },
    containerHeader:{
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%'
    },
    boasVindas:{
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff'
    },
    containerForm:{
        backgroundColor: '#fff',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    title:{
        fontSize: 20,
        marginTop: 15
    },
    input:{
        fontSize: 16,
        backgroundColor: '#d9d9d9',
        height: 40,
        marginBottom: 12
    },
    button:{
        backgroundColor: '#8000FF',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonRegister:{
        marginTop: 14,
        alignSelf: 'center'
    },
    registerText:{
        color: '#a1a1a1'
    }
})

