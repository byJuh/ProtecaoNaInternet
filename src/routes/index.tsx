import React from "react";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../screens/Home";

const Stack = createNativeStackNavigator();

export default function Rotas(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name = 'Home'
                component={HomeScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}