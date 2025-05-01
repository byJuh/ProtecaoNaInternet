import React from "react";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../screens/Home";
import Excluir_macAddress from "../screens/Excluir_macAddress";
import Tabs from "../Tabs";
import { RootStackParamList } from "../utils/types";
import Cadastro_macAddress from "../screens/Cadastro_macAddress";

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
                name = 'Tabs'
                component={Tabs}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}