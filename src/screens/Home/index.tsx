import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../constants/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/types";

//para obter o tipo do objeto de navegação
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function HomeScreen(){

   const navigation = useNavigation<NavigationProps>();

    return(
        <View style={[styles.container, {backgroundColor: '#C8D9E6'}]}>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate( 'Tabs', {screen: 'Principal' })}> 
            <Text style={styles.btnTexto}> Começar </Text>
          </TouchableOpacity>
        </View>
    )
}

/*const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#C8D9E6',
        justifyContent: 'center'
    },
    btn:{
        backgroundColor: '#9AB6CB',
        height: 55,
        width: 178,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnTexto:{
      color: '#FFFFFF',
      fontSize: 24,
      fontFamily: fontFamilies.ROBOTO.normal
    }

})*/