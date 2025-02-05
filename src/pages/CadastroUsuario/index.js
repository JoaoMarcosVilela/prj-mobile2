import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
import { TextInput } from "react-native-paper";
import { auth } from "../../Config";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";



export default function CadastroUsuario() {

    const navigate = useNavigation()

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [inputUsuario, setInputUsuario] = useState('');
    const [inputUsuarioNome, setInputUsuarioNome] = useState('');
    const [inputSenha, setInputSenha] = useState('');
    const [inputSenhaVilidacao, setInputSenhaVilidacao] = useState('');


    const handleSignUp = () => {
        if (inputSenha !== inputSenhaVilidacao) {
            Alert.alert("Erro", "As senhas não coincidem", [{ text: "OK" }]);
            return;
        }

        createUserWithEmailAndPassword(auth, inputUsuario, inputSenha)
            .then((userCredentials) => {
                const user = userCredentials.user;

                // Enviar o email de verificação
                sendEmailVerification(user)
                    .then(() => {
                        // Redirecionar para a tela de confirmação
                        navigate.navigate('ConfirmacaoEmail');
                    })
                    .catch((error) => {
                        Alert.alert("Erro", "Não foi possível enviar o email de verificação. Tente novamente.", [{ text: "OK" }]);
                    });
            })
            .catch((error) => {
                Alert.alert("Erro", error.message, [{ text: "OK" }]);
            });
    };

    const validarEmail = (email) => {
        // Expressão regular para validar o formato do e-mail
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        return regex.test(email);
    };


    useEffect(() => {
        getLista()
    }, [])

    const mudarVisibilidadeSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

    const showError = (message) => {
        Alert.alert("Erro", message, [{ text: "OK" }]);
    };

    const add = async () => {
        const db = await SQLite.openDatabaseAsync('databaseUsuarios');
        if (inputUsuario === '' || inputSenha === '') {
            showError('Por favor, preencha todos os campos');
        } else if (!validarEmail(inputUsuario)) {
            showError('Email Inválido');
        } else if (inputUsuario.length < 5) {
            showError('A usuario deve ter pelo menos 5 caracteres');
        } else if (inputSenha === '' || inputSenhaVilidacao === '') {
            showError('As duas senhas são obrigatórias');
        } else if (inputSenha !== inputSenhaVilidacao) {
            showError('As senhas não coincidem');
        } else if (inputSenha.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres')
        } else {
            try {



                const result = await db.getFirstAsync('SELECT * FROM usuarios WHERE usuario = ?', [inputUsuario]);
                if (result) {
                    showError('Usuario já cadastradado cadastrado');
                    setInputUsuario('');
                    setInputUsuarioNome('');
                    setInputSenha('');
                    setInputSenhaVilidacao('')
                } else {
                    await db.runAsync('INSERT INTO usuarios (usuario, nome, senha) VALUES (?, ?, ?)', inputUsuario, inputUsuarioNome, inputSenha);
                    handleSignUp()
                }
            } catch (error) {
                console.log('Erro ao acessar o banco de dados', error);
            }
        }
    };

    async function getLista() {
        const db = await SQLite.openDatabaseAsync('databaseUsuarios');
        await db.execAsync(`
                  PRAGMA journal_mode = WAL;
                  CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY NOT NULL, usuario TEXT NOT NULL, nome TEXT NOT NULL, senha TEXT NOT NULL);
                  `);
    }

    return (

        <View style={styles.container}>

            <View style={styles.containerHeader}>
                <Text style={styles.boasVindas}>Cadastro</Text>
            </View>

            <ScrollView scrollEnabled={false} style={styles.containerForm}>
                <Text style={styles.title}>Email</Text>
                <TextInput
                    placeholder="Digite seu email"
                    style={styles.input}
                    value={inputUsuario}
                    onChangeText={setInputUsuario}
                />

                <Text style={styles.title}>Nome</Text>
                <TextInput
                    placeholder="Digite seu nome"
                    style={styles.input}
                    value={inputUsuarioNome}
                    onChangeText={setInputUsuarioNome}
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput
                    placeholder="Digite sua senha"
                    style={styles.input}
                    value={inputSenha}
                    onChangeText={setInputSenha}
                    secureTextEntry={!mostrarSenha}
                    right={<TextInput.Icon icon={mostrarSenha ? 'eye' : 'eye-off'} onPress={mudarVisibilidadeSenha} />}
                />

                <Text style={styles.title}>Confirme a senha</Text>
                <TextInput
                    placeholder="Repita a senha"
                    style={styles.input}
                    value={inputSenhaVilidacao}
                    onChangeText={setInputSenhaVilidacao}
                    secureTextEntry={!mostrarSenha}
                />

                <TouchableOpacity style={styles.button}
                    onPress={add}
                >
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonRegister}
                    onPress={() => navigate.navigate('Login')}
                >
                    <Text style={styles.registerText}>Voltar</Text>
                </TouchableOpacity>
            </ScrollView >


        </View>

    )

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
    }
})

