import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../features/home/screens/Home";
import Excluir_macAddress from "../features/clientes/screens/ExcluirCliente";
import Tabs from "../features/tabs/screens";
import { RootStackParamList } from "../utils/types";
import Cadastro_macAddress from "../features/clientes/screens/CadastrarCliente";
import Tela_Explicacao from "../features/explicacao/screens/TelaExplicacao";
import CadastrarGrupos from "../features/grupos/screens/CadastrarGrupos";
import AdicionarDispositivos from '../features/dispositivos/screens/AdicionarDispositivos';
import ExcluirGrupo from '../features/grupos/screens/ExcluirGrupo';
import Desbloquear from "../features/sites/screens/ListaDeBloqueio";
import Desbloquear_Sites from "../features/sites/screens/DesbloqueioSites";
import TelaComoAcharMacAddress from "../features/explicacao/screens/TelaComoAcharMacAddress";
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
                options={{
                    title: 'Cadastrar Mac Address (Dispositivo)',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#567C8D' },
                    headerTintColor: '#F5EFEB',
                }}
            />
            <Stack.Screen
                name = 'Excluir_Mac'
                component={Excluir_macAddress}
                options={{
                    title: 'Excluir Mac Address (Dispositivo)',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#567C8D' },
                    headerTintColor: '#F5EFEB',
                }}
            />
            <Stack.Screen
                name = 'Excluir_Grupo'
                component={ExcluirGrupo}
                options={{
                    title: 'Excluir Grupo',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#567C8D' },
                    headerTintColor: '#F5EFEB',
                }}
            />
             <Stack.Screen
                name = 'Adicionar_Dispositivo'
                component={AdicionarDispositivos}
                options={{
                    title: 'Adicionar Mac Address (Dispositivo)',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#567C8D' },
                    headerTintColor: '#F5EFEB',
                }}
            />
             <Stack.Screen
                name = 'Tela_Explicacao'
                component={Tela_Explicacao}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name = 'Cadastrar_Grupo'
                component={CadastrarGrupos}
                options={{
                    title: 'Cadastrar Grupo',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#567C8D' },
                    headerTintColor: '#F5EFEB',
                }}
            />
            <Stack.Screen
                name = 'Desbloquear_Sites'
                component={Desbloquear_Sites}
                 options={{
                    title: 'Desbloquear Site',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#567C8D' },
                    headerTintColor: '#F5EFEB',
                }}
            />
            <Stack.Screen
                name = 'Lista_De_Bloqueio'
                component={Desbloquear}
                 options={{
                    title: 'Lista de Sites Bloqueados',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#567C8D' },
                    headerTintColor: '#F5EFEB',
                }}
            />
            <Stack.Screen
                name = 'Tela_Como_Achar_Mac'
                component={TelaComoAcharMacAddress}
                 options={{
                    title: 'Como Achar o MAC Address',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#567C8D' },
                    headerTintColor: '#F5EFEB',
                }}
            />
            <Stack.Screen
                name = 'Tabs'
                component={Tabs}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}