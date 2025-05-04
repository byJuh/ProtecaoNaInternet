import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../screens/Home";
import Excluir_macAddress from "../screens/ExcluirCliente";
import Tabs from "../Tabs";
import { RootStackParamList } from "../utils/types";
import Cadastro_macAddress from "../screens/CadastrarCliente";
import Tela_Explicacao from "../screens/TelaExplicação";
import CadastrarGrupos from "../screens/CadastrarGrupos";
import AdicionarDispositivos from '../screens/AdicionarDispositivos';
import ExcluirGrupo from '../screens/ExcluirGrupo';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Rotas(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name = 'Home'
                component={HomeScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name = 'Cadastrar_Mac'
                component={Cadastro_macAddress}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name = 'Excluir_Mac'
                component={Excluir_macAddress}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name = 'Excluir_Grupo'
                component={ExcluirGrupo}
                options={{headerShown: false}}
            />
             <Stack.Screen
                name = 'Adicionar_Dispositivo'
                component={AdicionarDispositivos}
                options={{headerShown: false}}
            />
             <Stack.Screen
                name = 'Tela_Explicacao'
                component={Tela_Explicacao}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name = 'Cadastrar_Grupo'
                component={CadastrarGrupos}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name = 'Tabs'
                component={Tabs}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}