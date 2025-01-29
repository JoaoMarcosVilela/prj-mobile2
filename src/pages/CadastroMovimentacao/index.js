import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';  // Importação corrigida
import { useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';

export default function CadastroMovimentacao() {
    const [inputTitulo, setInputTitulo] = useState('');
    const [inputValor, setInputValor] = useState('');
    const [tipo, setTipo] = useState('receita');  // Tipo (Receita ou Despesa)

    const [selectedDate, setSelectedDate] = useState(new Date()); // Data inicial como a data atual
    const [showDatePicker, setShowDatePicker] = useState(false); // Controle para exibir o seletor de data

    const route = useRoute();
    const { idUsuario, usuario, test } = route.params;
    const navigation = useNavigation();

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(false);
        setSelectedDate(currentDate); // Atualiza o estado com a data selecionada
    };

    const showError = (message) => {
        Alert.alert("Erro", message, [{ text: "OK" }]);
    };

    // Função para formatar a data no formato DD/MM/YYYY
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0'); // Adiciona 0 se o dia for menor que 10
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam de 0, então soma 1
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    async function salvar() {
        if (!inputTitulo || !inputValor || !selectedDate) {
            showError("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        // Verifica se o valor é um número válido
        if (isNaN(inputValor) || parseFloat(inputValor) <= 0) {
            showError("O valor deve ser um número válido e maior que 0.");
            return;
        }

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

        const formattedDate = formatDate(selectedDate); // Formata a data antes de salvar

        if (tipo === 'receita') {
            await db.runAsync('INSERT INTO movimentacoes (id_usuario, titulo, valor, data, tipo) VALUES (?, ?, ?, ?, ?)',
                idUsuario, inputTitulo, inputValor, formattedDate, 0
            );
            setInputTitulo('');
            setInputValor('');
            navigation.navigate('Home', { usuario: usuario, id: idUsuario });
        } else {
            await db.runAsync('INSERT INTO movimentacoes (id_usuario, titulo, valor, data, tipo) VALUES (?, ?, ?, ?, ?)',
                idUsuario, inputTitulo, inputValor, formattedDate, 1
            );
            setInputTitulo('');
            setInputValor('');
            navigation.navigate('Home', { usuario: usuario, id: idUsuario });
        }
    }

    async function update() {

        if (!inputTitulo || !inputValor || !selectedDate) {
            showError("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        // Verifica se o valor é um número válido
        if (isNaN(inputValor) || parseFloat(inputValor) <= 0) {
            showError("O valor deve ser um número válido e maior que 0.");
            return;
        }

        const db = await SQLite.openDatabaseAsync('databaseUsuarios');
        const formattedDate = formatDate(selectedDate);
        
        if (tipo === 'receita') {
            await db.runAsync(
                'UPDATE movimentacoes SET titulo = ?, valor = ?, data = ?, tipo = ? WHERE id = ?',
                [inputTitulo, inputValor, formattedDate, 0, test.id]
            );
            navigation.navigate('Home', { usuario: usuario, id: idUsuario });
        }else {
            await db.runAsync(
                'UPDATE movimentacoes SET titulo = ?, valor = ?, data = ?, tipo = ? WHERE id = ?',
                [inputTitulo, inputValor, formattedDate, 1, test.id]
            );
            navigation.navigate('Home', { usuario: usuario, id: idUsuario });
        }
    }

    async function apagar() {
        const db = await SQLite.openDatabaseAsync('databaseUsuarios');
        await db.runAsync('DELETE FROM movimentacoes WHERE id = ?', [test.id]);
        navigation.navigate('Home', { usuario: usuario, id: idUsuario });
    }

    // Função para converter a data do formato DD/MM/YYYY para o formato ISO 8601
    const convertToISOFormat = (dateString) => {
        const [day, month, year] = dateString.split('/'); // Divide a data no formato DD/MM/YYYY
        const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`); // Cria um novo objeto Date
        return formattedDate.toISOString(); // Retorna a data no formato ISO 8601
    };

    useEffect(() => {
        if (test) {
            setInputTitulo(test.titulo);
            setInputValor(test.valor.toString());
            setTipo(test.tipo === 0 ? 'receita' : 'despesa');
            const formattedDateTime = convertToISOFormat(test.data);
            setSelectedDate(new Date(formattedDateTime));
        }
    }, [test]);

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Text style={styles.boasVindas}>Adicionar nova movimentação</Text>
            </View>

            <ScrollView scrollEnabled={false} style={styles.containerForm}>
                <Text>Título</Text>
                <TextInput
                    placeholder="Digite o título"
                    style={styles.input}
                    value={inputTitulo}
                    onChangeText={setInputTitulo}
                />

                <Text>Valor</Text>
                <TextInput
                    placeholder="Digite o valor"
                    style={styles.input}
                    value={inputValor}
                    onChangeText={setInputValor}
                    keyboardType="numeric"
                />

                <Text>Data</Text>
                {/* Exibe a data formatada */}
                <Text>{formatDate(selectedDate)}</Text>

                <Button onPress={() => setShowDatePicker(true)} title="Selecionar Data" />

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <Text>Tipo</Text>
                <Picker
                    selectedValue={tipo}
                    onValueChange={(itemValue) => setTipo(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Receita" value="receita" />
                    <Picker.Item label="Despesa" value="despesa" />
                </Picker>

                {test ? (
                    <TouchableOpacity style={styles.button} onPress={update}>
                        <Text style={styles.buttonText}>Alterar Movimentação</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={salvar}>
                        <Text style={styles.buttonText}>Salvar Movimentação</Text>
                    </TouchableOpacity>
                )}

                {test && (
                    <TouchableOpacity style={styles.buttonDelete} onPress={apagar}>
                        <Text style={styles.buttonText}>Apagar</Text>
                    </TouchableOpacity>
                )}

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
        fontSize: 22,
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
    buttonDelete: {
        backgroundColor: '#FF0000',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    }
});
