import { View, Text, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';



export default function Balanco({idUsuario}) {

    const [ListMovimentacao, setListMovimentacao] = useState([]);
    const [saldoConta, setSaldoConta] = useState(0);
    const [saldoGasto, setSaldoGasto] = useState(0);

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

    useEffect(() => {
        if (idUsuario) {
            getLista(); // Chama a função para obter as movimentações quando o idUsuario for fornecido
        }
    }, [idUsuario]);

    useEffect(() => {
        let novoSaldo = 0;
        let novoGasto = 0;
        for (let index = 0; index < ListMovimentacao.length; index++) {

            if(ListMovimentacao[index].tipo === 0){
                const valorSaldo = parseFloat(ListMovimentacao[index].valor);
                novoSaldo += valorSaldo;
            }else{
                const valorGasto = parseFloat(ListMovimentacao[index].valor);
                novoGasto += valorGasto;
            }


            
        }
        setSaldoConta(novoSaldo);
        setSaldoGasto(novoGasto);
    }, [ListMovimentacao]);

    return (

        <View style={styles.container}>

            <View style={styles.item}>
                <Text style={styles.itemTitle}>Saldo</Text>
                <View style={styles.content}>
                    <Text style={styles.currencySymbol}>R$</Text>
                    <Text style={styles.balance}>{saldoConta.toFixed(2).replace(".", ",")}</Text>
                </View>
            </View>

            <View style={styles.item}>
                <Text style={styles.itemTitle}>Gastos</Text>
                <View style={styles.content}>
                    <Text style={styles.currencySymbol}>R$</Text>
                    <Text style={styles.expenses}>-{saldoGasto.toFixed(2).replace(".", ",")}</Text>
                </View>
            </View>


        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingStart: '5%',
        paddingEnd: '5%',
        marginTop: -25,
        marginStart: '5%',
        marginEnd: '5%',
        paddingTop: '5%',
        paddingBottom: '5%',
        borderRadius: 4,
        zIndex: 99,
    },
    itemTitle: {
        fontSize: 20,
        color: '#dadada'
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    currencySymbol: {
        color: '#dadada',
        marginRight: 6
    },
    balance: {
        fontSize: 22,
        color: '#2ecc71'
    },
    expenses: {
        fontSize: 22,
        color: '#e74c3c'
    }
})