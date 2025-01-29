import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from "react";
import * as SQLite from 'expo-sqlite';
import { useNavigation } from "@react-navigation/native";

import EyeButtom from '../EyeButtom';

export default function ListaMovimentacao({ idUsuario, usuario }) {
    const [ListMovimentacao, setListMovimentacao] = useState([]);
    const [mostrarValor, setMostrarValor] = useState(false);

    const navigation = useNavigation();

    // Função para buscar as movimentações do usuário
    async function getLista() {
        const db = await SQLite.openDatabaseAsync('databaseUsuarios');
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS movimentacoes (
                id INTEGER PRIMARY KEY NOT NULL, 
                id_usuario INTEGER, 
                titulo TEXT NOT NULL, 
                valor TEXT NOT NULL, 
                data TEXT, 
                tipo INTEGER,
                FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
            );
        `);

        const result = await db.getAllAsync('SELECT * FROM movimentacoes WHERE id_usuario = ?', [idUsuario]);

        let newArray = [];
        for (const row of result) {
            newArray.push({
                id: row.id,
                titulo: row.titulo,
                valor: row.valor,
                data: row.data,
                tipo: row.tipo
            });
        }

        setListMovimentacao(newArray);
    }

    async function update(item) {
        const test = {
            id: item.id,
            titulo: item.titulo,
            valor: item.valor,
            data: item.data,
            tipo: item.tipo
        }
        navigation.navigate('CadastroMovimentacao', {test, idUsuario, usuario});
    }

    useEffect(() => {
        if (idUsuario) {
            getLista(); // Chama a função para obter as movimentações quando o idUsuario for fornecido
        }
    }, [idUsuario]); // A dependência `idUsuario` faz a função ser chamada sempre que esse valor mudar


    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.header}>Movimentações do Usuário {usuario}</Text>
            <EyeButtom estado={mostrarValor} mudarValor={() => setMostrarValor(prev => !prev)} />

            {ListMovimentacao.length > 0 ? (
                ListMovimentacao.map((movimentacao) => (

                    <TouchableOpacity key={movimentacao.id} style={styles.item} onPress={() => update(movimentacao)}>
                        <Text style={styles.itemData}>{movimentacao.data}</Text>
                        <View style={styles.content}>
                            <Text style={styles.itemTitulo}>{movimentacao.titulo}</Text>

                            {mostrarValor ? (
                                <Text
                                    style={movimentacao.tipo === 0 ? styles.itemValor : styles.despesas}
                                >
                                    {movimentacao.tipo === 0 ? `R$ ${movimentacao.valor}` : `R$ -${movimentacao.valor}`}
                                </Text>
                            ) : (
                                <View style={styles.esconder}></View>
                            )}

                        </View>
                    </TouchableOpacity>
                )
                )
            ) : (
                <Text style={styles.noDataText}>Nenhuma movimentação encontrada. Adicione no icone abaixo</Text>
            )}



        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        marginTop: 16,
        padding: 16,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16
    },
    item: {
        backgroundColor: '#fff',
        marginTop: 2,
        marginBottom: '5%',
        borderRadius: 5,
    },
    itemData: {
        color: '#dadada',
        fontWeight: 'bold'
    },
    itemTitulo: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    itemValor: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2ecc71'
    },
    despesas: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e74c3c'
    },
    noDataText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20
    },
    esconder: {
        marginTop: 8,
        width: 80,
        height: 10,
        backgroundColor: '#dadada',
        borderRadius: 8
    },

});
