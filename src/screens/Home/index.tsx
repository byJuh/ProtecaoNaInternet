import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fontFamilies } from "../../constants/fonts";
import { styles } from "../../constants/styles";

export default function HomeScreen(){
    return(
        <View style={[styles.container, {backgroundColor: '#C8D9E6'}]}>
          <TouchableOpacity style={styles.btn}> 
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