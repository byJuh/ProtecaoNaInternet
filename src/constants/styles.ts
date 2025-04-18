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
        height: 677,
        width: 317,
    }
})