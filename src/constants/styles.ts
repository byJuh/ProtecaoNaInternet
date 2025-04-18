import { StyleSheet } from "react-native";
import { fontFamilies } from "./fonts";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
    },
    spaceContainer:{
        width: '90%',
        height: '90%',
        borderWidth: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderColor: '#567C8D'
    },
    scrollContainer:{
        paddingTop: 35
    }
})