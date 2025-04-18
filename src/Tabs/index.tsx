import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Principal from "./TelaPrincipal";
import Bloquear from "./Bloquear";


const Tab = createBottomTabNavigator();

const screenOptions = {
    tabBarStyle: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 50,
    },
    tabBarActiveTintColor: '#32AB6C',
    tabBarInactiveTintColor: '#8F9BB3',
};

const tabs = [
    {
        name: 'Principal',
        component: Principal,
        icon: 'list-alt',
    },
    {
        name: 'Bloquear',
        component: Bloquear,
        icon: 'app-blocking',
    },
];

export default function Tabs() {
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            {tabs.map((tab) => (
                <Tab.Screen
                    key={tab.name}
                    name={tab.name}
                    component={tab.component}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name={tab.icon} color={color} size={size} />
                        ),
                    }}
                />
            ))}
        </Tab.Navigator>
    );
}