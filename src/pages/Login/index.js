import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import { TextInput } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

import { auth } from "../../Config";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {

    const navigate = useNavigation()

    const [inputUsuario, setInputUsuarios] = useState('');
    const [inputSenha, setInputSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);

    useEffect(() => {
        getLista()
    }, [])

    const handleLogin = (result) => {
        signInWithEmailAndPassword(auth, inputUsuario, inputSenha)
            .then((userCredentials) => {
                const user = userCredentials.user;

                if (!user.emailVerified) {
                    // Se o email não for verificado
                    Alert.alert("Erro", "Por favor, verifique seu e-mail antes de continuar.", [{ text: "OK" }]);
                    return;
                }

                // Redirecionar para a tela principal após login bem-sucedido
                navigate.navigate('Home', { usuario: result.nome, id: result.id });
            })
            .catch((error) => {
                Alert.alert("Erro", error.message, [{ text: "OK" }]);
            });
    };

    const showError = (message) => {
        Alert.alert("Erro", message, [{ text: "OK" }]);
    };

    const mudarVisibilidadeSenha = () => {
        setMostrarSenha(!mostrarSenha);
        
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
            setInputUsuarios('');
            setInputSenha('');
            handleLogin(result);
        } else {
            showError('Usuário e senha inválidos ou usuário não cadastrado');
        }
    }

    return (
        <View style={styles.container}>

            <View style={styles.containerHeader}>
                <Text style={styles.boasVindas}>Bem-Vindo(a)</Text>
            </View>



            <ScrollView scrollEnabled={false} style={styles.containerForm}>
                <Text style={styles.title}>Usuário</Text>
                <TextInput
                    value={inputUsuario}
                    placeholder="Digite o usuário"
                    style={styles.input}
                    onChangeText={setInputUsuarios}
                    inlineImageLeft=''
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput
                    value={inputSenha}
                    placeholder="Sua senha"
                    style={styles.input}
                    secureTextEntry={!mostrarSenha}
                    onChangeText={setInputSenha}
                    right={<TextInput.Icon icon={mostrarSenha ? 'eye' : 'eye-off'} onPress={mudarVisibilidadeSenha} />}

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

                {/* <TouchableOpacity
                    style={styles.buttonTest}
                    onPress={() => navigate.navigate('Teste')}
                >
                    <Text style={styles.testeText}>TESTE</Text>
                </TouchableOpacity> */}

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