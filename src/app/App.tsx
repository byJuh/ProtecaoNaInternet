import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import Rotas from "../routes";
import { Alert, StatusBar } from "react-native";
import { hideNavigationBar } from 'react-native-navigation-bar-color';
import { connectWebSocket } from "../webSockets";
import 'react-native-get-random-values';

export default function App(){
  useEffect(() => {
    hideNavigationBar();

    const initWebSocket = async () => {
      try {
        const connectionId = await connectWebSocket();
        Alert.alert('✅', `Conectado! ID: ${connectionId}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        Alert.alert('❌', `Erro: ${errorMessage}`);
      }
    };
    
    initWebSocket();
  }, []);

  return(
    <>
      <StatusBar hidden />
      <NavigationContainer>
        <Rotas/>
      </NavigationContainer>
    </> 
  )
}