import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AdicionarGrupos from "./AdicionarGrupos";
import Bloquear from "../../sites/screens/TelaBloqueioSites";
import { TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator();

const screenOptions = {
    
    tabBarActiveTintColor: '#567C8D',
    tabBarInactiveTintColor: '#9DB2BF',
};

const tabs = [
    {
        name: 'Bloquear',
        component: Bloquear,
        icon: 'app-blocking',
    },
    {
        name: 'AdicionarGrupo',
        component: AdicionarGrupos,
        icon: 'add-circle-outline', 
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
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name={tab.icon} color={color} size={42} />
                        ),
                        tabBarButtonTestID:`tab-${tab.name}`,
                        tabBarLabelStyle:{
                            fontSize: 16, 
                            fontFamily: 'Roboto', 
                            fontWeight: 300,
                            paddingTop: 3
                        },
                        tabBarIconStyle: { 
                            width: 42, 
                            height: 42,
                        },
                        tabBarStyle: {
                            backgroundColor: '#C8D9E6',
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            height: '10%'
                        },
                        
                    }}
                />
            ))}
        </Tab.Navigator>
    );
}