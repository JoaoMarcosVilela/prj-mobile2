import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../Config"; // Certifique-se de importar o auth corretamente do seu arquivo de configuração
import { deleteUser } from "firebase/auth"; // Função para excluir o usuário

export default function Acoes({ idUsuario, usuarioName }) {
    const navigation = useNavigation();

    function showDeleteConfirmation() {
        Alert.alert(
            "Confirmar exclusão",
            "Tem certeza que deseja remover o usuário? Esta ação não pode ser desfeita.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: remove
                }
            ]
        );
    }

    async function remove() {
        const user = auth.currentUser; // Obtemos o usuário autenticado

        if (user) {
            try {
                // Excluir dados do banco SQLite
                const db = await SQLite.openDatabaseAsync('databaseUsuarios');
                await db.runAsync('DELETE FROM movimentacoes WHERE id_usuario = ?', [idUsuario]);
                await db.runAsync('DELETE FROM usuarios WHERE id = ?', [idUsuario]);

                // Excluir usuário no Firebase Authentication
                await deleteUser(user);

                // Deslogar o usuário
                await auth.signOut();

                // Navegar para a tela de login
                navigation.navigate('Login');

                // Notificar o usuário que a conta foi excluída com sucesso
                Alert.alert("Conta excluída", "Sua conta foi excluída com sucesso.");

            } catch (error) {
                console.log('Erro ao excluir a conta:', error);
                Alert.alert("Erro", "Ocorreu um erro ao tentar excluir sua conta. Tente novamente.");
            }
        }
    }

    return (
        <ScrollView style={styles.container} horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('CadastroMovimentacao', { idUsuario: idUsuario, usuario: usuarioName })}>
                <View style={styles.areaButton}>
                    <AntDesign name='addfolder' size={26} color={'#000'} />
                </View>
                <Text style={styles.textoButton}>Entradas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={showDeleteConfirmation}>
                <View style={styles.areaButton}>
                    <MaterialCommunityIcons name='delete' size={26} color={'#000'} />
                </View>
                <Text style={styles.textoButton}>Apagar conta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Login')}>
                <View style={styles.areaButton}>
                    <MaterialCommunityIcons name='exit-to-app' size={26} color={'#000'} />
                </View>
                <Text style={styles.textoButton}>Sair</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 84,
        marginBottom: '5%',
        marginTop: '5%',
        paddingStart: '5%',
        paddingEnd: '5%'
    },
    actionButton: {
        alignItems: 'center',
        marginRight: '22%'
    },
    areaButton: {
        backgroundColor: '#ecf0f1',
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textoButton: {
        marginTop: 7,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});
