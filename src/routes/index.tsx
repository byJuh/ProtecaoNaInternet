import React from "react";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../screens/Home";
import TelaPrincipal from "../Tabs/TelaPrincipal";
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
                name = 'Tabs'
                component={Tabs}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}