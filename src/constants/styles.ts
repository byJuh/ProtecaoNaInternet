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
        height: '6.6%',
        width: '45%',
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
    },
    input: {
        width: '70%',
        height: '6.6%',
        backgroundColor: '#F5EFEB',
        borderRadius: 30,
        marginBottom: 15,
        fontSize: 15,
        paddingLeft: 20,
    },
    texto:{
        fontSize: 15,
        color: '#6AA9D0',
        fontFamily: fontFamilies.ROBOTO.bold,
        textDecorationLine: 'underline',
        marginBottom: 100
    },
    spaceContainerAddBlock:{
        width: '90%',
        height: '80%',
        borderWidth: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderColor: '#567C8D'
    },
    separator: { height: 8 },
    lista: { marginBottom: 20 },
    item: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 6 },
    nome: { fontSize: 16, fontWeight: 'bold' },
    mac: { fontSize: 14, color: '#666' },
    
    
})