import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

export default function Login() {

    const navigate = useNavigation()

    const [inputUsuario, setInputUsuarios] = useState('');
    const [inputSenha, setInputSenha] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        getLista()
    }, [])

    const showError = (message) => {
        Alert.alert("Erro", message, [{ text: "OK" }]);
    };

    async function getLista() {
        const db = await SQLite.openDatabaseAsync('databaseUsuarios');
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY NOT NULL, usuario TEXT NOT NULL, senha TEXT NOT NULL);
            `);    
    }

    async function verificacao() {
        const db = await SQLite.openDatabaseAsync('databaseUsuarios');
        const result = await db.getFirstAsync('SELECT * FROM usuarios WHERE usuario = ? AND senha = ?', [inputUsuario, inputSenha]);
        if (result) {
            navigate.navigate('Home', { usuario: result.usuario, id: result.id });
        } else {
            showError('Usuário e senha inválidos ou usuário não cadastrado');
        }
    }

    return (
        <View style={styles.container}>

            <View style={styles.containerHeader}>
                <Text style={styles.boasVindas}>Bem-Vindo(a)</Text>
            </View>



            <View style={styles.containerForm}>
                <Text style={styles.title}>Usuário</Text>
                <TextInput
                    placeholder="Digite o usuário"
                    style={styles.input}
                    onChangeText={setInputUsuarios}
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput
                    placeholder="Sua senha"
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={setInputSenha}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={verificacao}
                >
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonRegister}
                    onPress={() => navigate.navigate('CadastroUsuario')}
                >
                    <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonTest}
                    onPress={() => navigate.navigate('Teste')}
                >
                    <Text style={styles.testeText}>TESTE</Text>
                </TouchableOpacity>

            </View>


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