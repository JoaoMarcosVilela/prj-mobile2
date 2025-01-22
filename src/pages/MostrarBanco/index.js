import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';
import { StatusBar } from "expo-status-bar";

export default function MostarBanco(){
    const [listUsuarios, setListUsuarios] = useState([]);
    const [textInputEmail, setTextInputEmail] = useState('')
    const [textInputSenha, setTextInputSenha] = useState('')

    async function addNew(){
        // let newArray = listUsuarios;
        // newArray.push(textInput);
        // setListUsuarios(newArray);
        
        // console.log(textInputEmail);
        // console.log(textInputSenha);
        const db = await SQLite.openDatabaseAsync('databaseUsuarios');
        // console.log(listUsuarios);

        if(textInputEmail != '' && textInputSenha != ''){
            const result = await db.getFirstAsync('SELECT * FROM usuarios WHERE usuario = ?', [textInputEmail]);
            console.log(result)
            if(result){
                console.log('Usuario já cadastradado cadastrado')
            }else{
                await db.runAsync('INSERT INTO usuarios (usuario, senha) VALUES (?, ?)', textInputEmail, textInputSenha);
                console.log('Inserido');
            }
            getLista()
            return;
        }

    }
    async function remove(item){
        const db = await SQLite.openDatabaseAsync('databaseUsuarios');
        // console.log('Removendo: '+item);
        await db.runAsync('DELETE FROM movimentacoes WHERE id_usuario = ?', [item.id]);
        await db.runAsync('DELETE FROM usuarios WHERE id = ?', [item.id]);
        getLista()

    }

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
            newArray.push({
                id: row.id,
                usuario: row.usuario,
                senha: row.senha
            });
        }
        console.log(newArray);
        setListUsuarios(newArray);
    }

    useEffect(() => {
        // async function setup() {
        //     // const db = await SQLite.openDatabaseAsync('databaseUsuarios');

        //     // await db.execAsync(`
        //     //     PRAGMA journal_mode = WAL;
        //     //     CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY NOT NULL, email TEXT NOT NULL, senha TEXT NOT NULL);
        //     //     INSERT INTO usuarios (email, senha) VALUES ('t1@.t1.com', '123');
        //     //     INSERT INTO usuarios (email, senha) VALUES ('t2@.t2.com', '456');
        //     //     INSERT INTO usuarios (email, senha) VALUES ('t2@.t2.com', '789');
        //     //     `);

        //     getLista()
        // }
        getLista();
    }, [])
    
    return(
        <ScrollView  contentContainerStyle={styles.container}>
            <TextInput style={styles.input} onChangeText={setTextInputEmail}></TextInput>
            <TextInput style={styles.input} onChangeText={setTextInputSenha} secureTextEntry={true}></TextInput>
            <TouchableOpacity onPress={() => addNew()}>
                <Text style={styles.button}>Add</Text>
            </TouchableOpacity>

            
            {listUsuarios.map((item) => {
                return (
                    <View key={item.id} style={styles.userItem}>
                        <Text>ID: {item.id}</Text>
                        <Text>Usuário: {item.usuario}</Text>
                        <Text>Senha: {item.senha}</Text>
                        <TouchableOpacity onPress={() => remove(item)}>
                            <Text style={styles.button}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
            <StatusBar style="auto"/>
        </ScrollView >
            
    );
}

const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input:{
        marginTop: 50,
        height:40,
        width: '80%',
        borderColor: 'black',
        borderWidth: 1,
        padding: 10
    },
    button:{
        backgroundColor: '#A9A9A9',
        marginTop: 14,
        marginBottom: 14,
        height: 40,
        width: 40,
        textAlign: 'center',
        justifyContent: 'center'
    }
})