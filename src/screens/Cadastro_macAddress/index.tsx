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
  const onChangeMacAddressHandler = async (macAddress: string) => {
    setMacAddress(macAddress);
  }

  const onChangeNomeDispositivoHandler = async (nomeDispositivo: string) => setNomeDispositivo(nomeDispositivo);

  //REVER
  const formatMacAddress = (macAddress: string): string | null => {
      if (!macAddress || macAddress.trim() === "" || macAddress.length != 12) {
        return null;
      }
      let macAddressFormatted = macAddress.toUpperCase()
      macAddressFormatted = macAddressFormatted.match(/.{1,2}/g)?.join(":") ?? "";
      return macAddressFormatted;
  }

  const cadastrarMacNome = async () =>{
    if(!macAddress || !nomeDispositivo){
        Alert.alert("Preencha todos os campos!");
        return;
    }

    let macAddressFormatted = macAddress

    var regex = /^(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})$/
    if(!macAddress.match(regex))  {
      const formatted = formatMacAddress(macAddress);
      if (formatted) {
        macAddressFormatted = formatted;
      } else {
        // opcional: alertar erro
        Alert.alert("MAC inválido!");
        return;
      }
    }

    //armazenar no asyncStorage
    try{
      const dispositivosSalvos = await AsyncStorage.getItem('dispositivos');
      let dispositivos = dispositivosSalvos ? JSON.parse(dispositivosSalvos) : [];

      if (!Array.isArray(dispositivos)) dispositivos = [];

      dispositivos.push({ nome: nomeDispositivo, mac: macAddressFormatted });
      await AsyncStorage.setItem('dispositivos', JSON.stringify(dispositivos));
      
      Alert.alert("Sucesso", "Dispositivo salvo!");

      setMacAddress("");
      setNomeDispositivo("");

      navigation.navigate('Tabs', { screen: 'Principal' });

    }catch (error){
        //nn foi possivel salvar (ALARME -> VER!!)
        console.error("Erro ao salvar o MAC address", error);
    }

  }

  return(
    //diminuindo de tamanho -> VERIFICAR!!!
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
        <ScrollView contentContainerStyle={[styles.container, {backgroundColor: '#C8D9E6'}]} keyboardShouldPersistTaps="handled">
          <TextInput
              style={styles.input}
              placeholder={'Mac Address'}
              placeholderTextColor={'#9DB2BF'}
              value={macAddress}
              maxLength={17}       
              keyboardType="visible-password"
              autoCapitalize = {"characters"}
              autoCorrect={false}
              onChangeText={onChangeMacAddressHandler}  
                
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