import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../constants/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

//para obter o tipo do objeto de navegação
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function HomeScreen(){

  const navigation = useNavigation<NavigationProps>();

  const mudandoTela = async () => {
    try{  

      const dispositivo = await AsyncStorage.getItem('dispositivos')

      if(dispositivo) navigation.navigate('Tabs', {screen: 'Principal'})
      else navigation.navigate('Cadastrar_Mac')
    
    }catch(error){
      console.error("Erro ao verificar");
    }
    
  }

  return(
      <View style={[styles.container, {backgroundColor: '#C8D9E6'}]}>
        <TouchableOpacity style={styles.btn} onPress={() => mudandoTela()}> 
          <Text style={styles.btnTexto}> Começar </Text>
        </TouchableOpacity>
      </View>
  )
}