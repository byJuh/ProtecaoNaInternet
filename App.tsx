import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import Rotas from "./src/routes";


export default function App(){
    return(
        <NavigationContainer>
          <Rotas/>
        </NavigationContainer>
    )
}