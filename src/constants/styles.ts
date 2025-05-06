import { StyleSheet } from "react-native";
import { fontFamilies } from "./fonts";
import type { PickerStyle } from 'react-native-picker-select';

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
        borderColor: '#567C8D',
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
    separator: { 
        height: 8 
    },
    lista: { 
        marginBottom: 20,
        fontSize: 20,
        fontFamily: fontFamilies.ROBOTO.bold
    },
    item: { 
        padding: 10, 
        backgroundColor: '#f0f0f0', 
        borderRadius: 6 
    },
    nome: { 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    mac: { 
        fontSize: 14, 
        color: '#666' 
    },
    select: {
        borderRadius: 100, // Isso sim funcionará
        width: '75%',
        overflow: 'hidden',
    },
    explicacao: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        height: '75%', 
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        position: 'absolute',
        top: '10%',
        alignContent: 'center',
    },
    blocoTitulo: {
        backgroundColor: '#2F4156',
        width: '100%',
        height: '10%', 
        position: 'absolute',
        top: '0%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fontFamilies.ROBOTO.bold
    },
    textoTitulo:{
        color: '#FFFFFF',
        fontSize: 24,
        marginRight: 10,
        fontFamily: fontFamilies.ROBOTO.normal
    },
    textoExplicativo:{
        color: '#000000',
        fontFamily: fontFamilies.ROBOTO.normal,
        margin: '10%',
        fontSize: 25
    },
    scroll:{
        flexDirection: 'column',
        alignContent: 'center',
    },
})

export const pickerSelectStyles: PickerStyle = {
    inputAndroid: {
        backgroundColor: '#F5EFEB',
        width: '100%',
        paddingVertical: 10,
        fontSize: 15,
    },
    placeholder: {
        color: '#9DB2BF',           
        fontSize: 15,          
        fontStyle: 'italic',
    },
}

export const pickerSelectStylesBloquear: PickerStyle = {
    inputAndroid: {
        backgroundColor: '#9AB6CB',
        width: '100%',
        paddingVertical: 2,
        fontSize: 15,
    },
    placeholder: {
        color: '#F5EFEB',           
        fontSize: 15,          
        fontStyle: 'italic',
    },
}