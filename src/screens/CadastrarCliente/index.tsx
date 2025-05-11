import React, { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { styles } from "../../constants/styles";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/types";
import { carregarDispositivos, salvarDispositivos } from "../../services/salvarDispositivos";
import { addClient } from "../../services/requests";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
type RouteProps = RouteProp<RootStackParamList, 'Cadastrar_Mac'>;

export default function Cadastro_cliente({ route } : {route: RouteProps}){

  const {nomeGrupo} = route.params;
  const navigation = useNavigation<NavigationProps>();
  
  const [macAddress, setMacAddress] = useState("");
  const [nomeDispositivo, setNomeDispositivo] = useState("");

  const onChangeMacAddressHandler = async (macAddress: string) => setMacAddress(macAddress);

  const onChangeNomeDispositivoHandler = async (nomeDispositivo: string) => setNomeDispositivo(nomeDispositivo);

  //REVER
  const formatMacAddress = (macAddress: string): string | null => {
      if (!macAddress || macAddress.trim() === "") {
        return null;
      }

      let macAddressFormatted = macAddress.toUpperCase()

      //removendo todos os caracteres que não sejam hexadecimais, deixando apenas os válidos
      macAddressFormatted = macAddressFormatted.replace(/[^a-fA-F0-9]/g, '');

      if(macAddressFormatted.length != 12) return null
      else return macAddressFormatted.match(/.{1,2}/g)?.join(":") ?? '';
  }

  const cadastrarMacNome = async () =>{
    if(!macAddress || !nomeDispositivo){
        Alert.alert("Preencha todos os campos!");
        return;
    }

    let macAddressFormatted = macAddress

    //regex para formato MacAddress, verificando se ja esta no formato
    var regex = new RegExp(/^(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})$/)

    if(!macAddressFormatted.match(regex))  {
      //caso nao esteja no formato, formatar
      
      const formatted = formatMacAddress(macAddress);
      
      if (formatted) macAddressFormatted = formatted;
      else {
        Alert.alert("MAC inválido!");
        return;
      }
    } else macAddressFormatted = macAddress.toUpperCase()

    try{
      const dispositivos = await carregarDispositivos(nomeGrupo)
      
      if(dispositivos && dispositivos.find(d => d.mac == macAddress)){
        Alert.alert("Erro", "Esse dispositivo já está no grupo!!",
          [
            {text: 'Ok', onPress: () => {
              setMacAddress("");
              setNomeDispositivo("");
        
             navigation.navigate('Tabs', { screen: 'AdicionarGrupos' });
            }}
          ]
        )
      }
      const response = await addClient(macAddressFormatted, nomeGrupo)
      
      if(response){
        await salvarDispositivos(nomeDispositivo, macAddressFormatted, nomeGrupo)

        Alert.alert("Sucesso", "Dispositivo salvo no grupo!",
          [
            {text: 'Ok', onPress: () => {
              setMacAddress("");
              setNomeDispositivo("");
        
              navigation.navigate('Tabs', { screen: 'Principal' });
            }}
          ]
        );
     
      }
      

    }catch (error){
      if(error instanceof Error) {
        Alert.alert("Erro", error.message);
      }
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