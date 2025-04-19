import React, { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { styles } from "../../constants/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/types";

//ESSA TELA SO APARECE UMA VEZ

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function Cadastro_macAddress(){

  const navigation = useNavigation<NavigationProps>();
  
  const [macAddress, setMacAddress] = useState("");
  const [nomeDispositivo, setNomeDispositivo] = useState("");

   //fazer um set com formato FF:FF:FF:FF:FF:FF
  const onChangeMacAddressHandler = async (macAddress: string) => setMacAddress(macAddress);
  const onChangeNomeDispositivoHandler = async (nomeDispositivo: string) => setNomeDispositivo(nomeDispositivo);

  const cadastrarMacNome = async () =>{
    if(!macAddress || !nomeDispositivo){
        Alert.alert("Preencha todos os campos!");
        return;
    }
    //armazenar no asyncStorage
    try{
        const dispositivo = {
            macAddress,
            nomeDispositivo,
        };

        //salvando o nome com o mac
        await AsyncStorage.setItem('dispositivos', JSON.stringify(dispositivo))
        Alert.alert("Sucesso", "Dispositivo salvo!");

        //indo para a tela principal
        navigation.navigate('Tabs', {screen: 'Principal'})

    }catch (error){
        //nn foi possivel salvar (ALARME -> VER!!)
        console.error("Erro ao salvar o MAC address", error);
    }

  }

  return(
    //diminuindo de tamanho -> VERIFICAR!!!
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
        <ScrollView contentContainerStyle={[styles.container, {backgroundColor: '#C8D9E6'}]} keyboardShouldPersistTaps="handled">
          <TextInput
              style={styles.input}
              placeholder={'Mac Address'}
              placeholderTextColor={'#9DB2BF'}
              value={macAddress}
              maxLength={17}
              onChangeText={onChangeMacAddressHandler}                
              keyboardType="visible-password"
              autoCapitalize="characters"
              autoCorrect={false}
                
          />
          <TextInput
              style={[styles.input, {marginBottom: 15}]}
              placeholder={'Nome do Dispositivo'}
              placeholderTextColor={'#9DB2BF'}
              value={nomeDispositivo}
              onChangeText={onChangeNomeDispositivoHandler}
          />
          <TouchableOpacity>
            <Text  style={styles.texto}>
              Como encontrar o mac address?
            </Text>    
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => cadastrarMacNome()}>
              <Text style = {styles.btnTexto}>
                Adicionar
              </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
        
  )
}