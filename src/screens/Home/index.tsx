import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../constants/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/types";
import { verificarQuantidadeGrupos } from "../../services/salvarDispostivos";

//para obter o tipo do objeto de navegação
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function HomeScreen(){

  const navigation = useNavigation<NavigationProps>();

  const mudandoTela = () => {
    try{ 
      const telaPrincipal = verificarQuantidadeGrupos();

      console.log("verificarQuantidadeGrupos:", verificarQuantidadeGrupos());

      if(telaPrincipal) navigation.replace('Tabs', {screen: 'Bloquear'})
      else navigation.navigate('Tela_Explicacao')
    
    }catch(error){
      console.error("Erro ao verificar"); 
      
    }
    
  }

  return(
      <View style={[styles.container, {backgroundColor: '#C8D9E6'}]}>
        <TouchableOpacity accessibilityRole='button' style={styles.btn} onPress={() => mudandoTela()}> 
          <Text style={styles.btnTexto}> Começar </Text>
        </TouchableOpacity>
      </View>
  )
}