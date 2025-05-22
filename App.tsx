import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import Rotas from "./src/routes";
import { StatusBar } from "react-native";
import { hideNavigationBar } from 'react-native-navigation-bar-color';

export default function App(){
  useEffect(() => {
    hideNavigationBar();
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