import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BemVindo from "../pages/BemVindo";
import Home from "../pages/home";
import Login from "../pages/Login";
import CadastroUsuario from "../pages/CadastroUsuario";
import CadastroMovimentacao from "../pages/CadastroMovimentacao";
import MostarBanco from "../pages/MostrarBanco";
import ConfirmacaoEmail from "../pages/ConfirmacaoEmail";
import RecuperarConta from "../pages/RecuperarConta";

const Stack = createNativeStackNavigator();

export default function Routes(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="BemVindo"
                component={BemVindo}
                options={{ headerShown: false}}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false}}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false}}
            />
            <Stack.Screen
                name="CadastroUsuario"
                component={CadastroUsuario}
                options={{ headerShown: false}}
            />
            <Stack.Screen
                name="RecuperarConta"
                component={RecuperarConta}
                options={{ headerShown: false}}
            />
            <Stack.Screen
                name="ConfirmacaoEmail"
                component={ConfirmacaoEmail}
                options={{ headerShown: false}}
            />
            <Stack.Screen
                name="CadastroMovimentacao"
                component={CadastroMovimentacao}
                options={{ headerShown: false}}
            />
            <Stack.Screen
                name="Teste"
                component={MostarBanco}
                options={{ headerShown: false}}
            />
        </Stack.Navigator>
    )
}