import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

export default function CadastroUsuario() {

    const navigate = useNavigation()

    const [listUsuarios, setListUsuarios] = useState([]);
    const [inputUsuario, setInputUsuario] = useState('');
    const [inputSenha, setInputSenha] = useState('');
    const [inputSenhaVilidacao, setInputSenhaVilidacao] = useState('');



    useEffect(() => {
        getLista()
    }, [])

    const showError = (message) => {
        Alert.alert("Erro", message, [{ text: "OK" }]);
    };

    const add = async () => {
        const db = await SQLite.openDatabaseAsync('databaseUsuarios');
        if (inputUsuario === '' || inputSenha === '') {
            console.log('Por favor, preencha todos os campos');
            showError('Por favor, preencha todos os campos');
        } else if (inputSenha === '' || inputSenhaVilidacao === '') {
            console.log('As duas senhas são obrigatórias');
            showError('As duas senhas são obrigatórias');
        } else if (inputSenha !== inputSenhaVilidacao) {
            console.log('As senhas não coincidem');
            showError('As senhas não coincidem');
        } else {
            try {
                const result = await db.getFirstAsync('SELECT * FROM usuarios WHERE usuario = ?', [inputUsuario]);
                if (result) {
                    showError('Usuario já cadastradado cadastrado');
                    setInputUsuario('');
                    setInputSenha('');
                    setInputSenhaVilidacao('')
                } else {
                    await db.runAsync('INSERT INTO usuarios (usuario, senha) VALUES (?, ?)', inputUsuario, inputSenha);
                    navigate.navigate('Login');
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
                  CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY NOT NULL, usuario TEXT NOT NULL, senha TEXT NOT NULL);
                  `);
        const allRows = await db.getAllAsync('SELECT * FROM usuarios');
        let newArray = [];
        for (const row of allRows) {
            // console.log(row.id, row.usuario, row.senha);
            newArray.push(row.usuario);
        }
        setListUsuarios(newArray);
        console.log(listUsuarios)
    }

    return (

        <View style={styles.container}>

            <View style={styles.containerHeader}>
                <Text style={styles.boasVindas}>Cadastro</Text>
            </View>

            <View style={styles.containerForm}>
                <Text style={styles.title}>Usuário</Text>
                <TextInput
                    placeholder="Digite seu usuario"
                    style={styles.input}
                    value={inputUsuario}
                    onChangeText={setInputUsuario}
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput
                    placeholder="Digite sua senha"
                    style={styles.input}
                    value={inputSenha}
                    onChangeText={setInputSenha}
                    secureTextEntry={true}
                />

                <Text style={styles.title}>Confirme a senha</Text>
                <TextInput
                    placeholder="Repita a senha"
                    style={styles.input}
                    value={inputSenhaVilidacao}
                    onChangeText={setInputSenhaVilidacao}
                    secureTextEntry={true}
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
            </View>


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

