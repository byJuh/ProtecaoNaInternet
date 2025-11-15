import React, { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { styles } from "../../../constants/styles";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../utils/types";
import { carregarDispositivos, salvarDispositivos } from "../../../services/salvarDispostivos";
import { addClient } from "../../../services/requests";
import { deletarDispositivo } from "../../../services/salvarDispostivos";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
type RouteProps = RouteProp<RootStackParamList, 'Cadastrar_Mac'>;

export default function Cadastro_cliente({ route } : {route: RouteProps}){

  const {nomeGrupo} = route.params;
  const navigation = useNavigation<NavigationProps>();
  
  const [macAddress, setMacAddress] = useState("");
  const [nomeDispositivo, setNomeDispositivo] = useState("");

  const onChangeNomeDispositivoHandler = async (nomeDispositivo: string) => setNomeDispositivo(nomeDispositivo);

  const formatMacAddress = (macAddress: string) => {
      const macAddressFormated = macAddress.toUpperCase().replace(/[^a-fA-F0-9]/g, '').match(/.{1,2}/g)?.join(":") ?? '';
      setMacAddress(macAddressFormated);
  } 

  const cadastrarMacNome = async () =>{
    if(!macAddress || !nomeDispositivo){
        Alert.alert("Preencha todos os campos!");
        return;
    }

    try{

      if(macAddress.length !== 17){
        Alert.alert("Erro", "Mac Address inválido!!");
        return;
      }

      const dispositivos = carregarDispositivos(nomeGrupo)
      
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
        return;
      }
      
      const response = await addClient(macAddress, nomeGrupo)
      
      if(response){
        salvarDispositivos(nomeDispositivo, macAddress, nomeGrupo);
        Alert.alert("Sucesso", response,
          [
            {text: 'Ok', onPress: () => {
              setMacAddress("");
              setNomeDispositivo("");
        
              navigation.navigate('Tabs', { screen: 'Bloquear' });
            }}
          ]
        );
      } else {
        Alert.alert("Erro", "Erro ao salvar o dispositivo!!");
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
              style={[styles.input, {marginBottom: 15, color:'#9DB2BF'}]}
              placeholder={'Mac Address'}
              placeholderTextColor={'#9DB2BF'}
              value={macAddress}
              maxLength={17}       
              keyboardType="visible-password"
              autoCapitalize = {"characters"}
              autoCorrect={false}
              onChangeText={formatMacAddress}  
              testID="input-macAddress"
          />
          <TextInput
              style={[styles.input, {marginBottom: 15, color:'#9DB2BF'}]}
              placeholder={'Nome do Dispositivo'}
              placeholderTextColor={'#9DB2BF'}
              value={nomeDispositivo}
              onChangeText={onChangeNomeDispositivoHandler}
              testID="input-nomeDispositivo"
          />
          <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate('Tela_Como_Achar_Mac')}>
            <Text  style={styles.texto}>
              Como encontrar o mac address?
            </Text>    
          </TouchableOpacity>

          <TouchableOpacity accessibilityRole="button" style={styles.btn} onPress={() => cadastrarMacNome()}>
              <Text style = {styles.btnTexto}>
                Adicionar
              </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
        
  )
}