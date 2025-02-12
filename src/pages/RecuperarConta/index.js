import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

import { auth } from "../../Config";
import { sendPasswordResetEmail } from 'firebase/auth';

export default function RecuperarConta() {

    const [inputUsuario, setInputUsuarios] = useState('');
    const navigate = useNavigation()

    // Função para recuperação de conta
    const recuperarConta = (email) => {
        if (email) {
            sendPasswordResetEmail(auth, email) // Correção aqui
                .then(() => {
                    Alert.alert("Sucesso", "Um e-mail para redefinir sua senha foi enviado!", [{ text: "OK" }]);
                })
                .catch((error) => {
                    let errorMessage = error.message;
                    if (errorMessage.includes('auth/user-not-found')) {
                        errorMessage = 'Usuário não encontrado. Verifique o e-mail.';
                    }
                    Alert.alert("Erro", errorMessage, [{ text: "OK" }]);
                });
        } else {
            Alert.alert("Erro", "Por favor, insira um e-mail válido", [{ text: "OK" }]);
        }
    };

    async function verificacao() {

        if (validarEmail(inputUsuario)) {
            const db = await SQLite.openDatabaseAsync('databaseUsuarios');
            const result = await db.getFirstAsync('SELECT * FROM usuarios WHERE usuario = ?', [inputUsuario]);
            if (result) {
                setInputUsuarios('')
                recuperarConta(inputUsuario);
                navigate.navigate('Login');
            } else {
                Alert.alert("Erro", "Usuário não cadastrado", [{ text: "OK" }]);
            }
        } else {
            Alert.alert("Erro", "Email invalido", [{ text: "OK" }]);
        }


    }

    const validarEmail = (email) => {
        // Expressão regular para validar o formato do e-mail
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        return regex.test(email);
    };


    return (
        <View style={styles.container}>

            <View style={styles.containerHeader}>
                <Text style={styles.boasVindas}>Recuperar Conta</Text>
            </View>



            <ScrollView scrollEnabled={false} style={styles.containerForm}>
                <Text style={styles.title}>Email</Text>
                <TextInput
                    value={inputUsuario}
                    placeholder="Digite seu email"
                    style={styles.input}
                    onChangeText={setInputUsuarios}
                />


                <TouchableOpacity
                    style={styles.button}
                    onPress={verificacao}
                >
                    <Text style={styles.buttonText}>Enviar email de recuperação</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonRegister}
                    onPress={() => navigate.navigate('Login')}
                >
                    <Text style={styles.registerText}>Voltar</Text>
                </TouchableOpacity>


            </ScrollView>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8000FF'
    },
    containerHeader: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%'
    },
    boasVindas: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff'
    },
    containerForm: {
        backgroundColor: '#fff',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    title: {
        fontSize: 20,
        marginTop: 15
    },
    input: {
        fontSize: 16,
        backgroundColor: '#d9d9d9',
        height: 40,
        marginBottom: 12
    },
    button: {
        backgroundColor: '#8000FF',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonRegister: {
        marginTop: 14,
        alignSelf: 'center'
    },
    registerText: {
        color: '#a1a1a1'
    },
    buttonTest: {
        marginTop: 50,
        backgroundColor: 'red'
    },
    testeText: {
        alignContent: 'center',
        textAlign: 'center'
    }
})