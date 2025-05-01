import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { pickerSelectStyles, styles } from "../../constants/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dispositivo, RootStackParamList } from "../../utils/types";
import RNPickerSelect from 'react-native-picker-select';
import { carregarDispositivos } from "../../services/salvarMacAddress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function Excluir_macAddress(){

  const navigation = useNavigation<NavigationProps>();
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [macAddress, setMacAddress] = useState("");
  
  useEffect(() => {
      async function fetchDispositivos() {
        try {
            const dispositivosSalvos = await carregarDispositivos();
              
            if(dispositivosSalvos != null) setDispositivos(dispositivosSalvos);
          
        } catch (error: unknown) {
            if (error instanceof Error) {
              Alert.alert("Erro", error.message);
            }
          }
        }
      fetchDispositivos();
  }, []);

  const excluirDispositivo = async() => {
    try{
      if(macAddress != null){
      
        let dispositivosSalvos = dispositivos.filter(d => d.mac !== macAddress)
        await AsyncStorage.setItem('dispositivos', JSON.stringify(dispositivosSalvos))
  
        var mensagem = "Dispositivo de MAC: " + macAddress + " foi removido!"
        Alert.alert("Removido", mensagem)

        navigation.navigate('Tabs', { screen: 'Principal' });
      }
    }catch(error){
      Alert.alert("Não foi possível remover!!")
    }
    
  }

  return(
    <View style = {[styles.container, {backgroundColor: '#C8D9E6'}]}>
      <View style = {styles.select}>
        <RNPickerSelect 
          placeholder={{ label: 'Selecione um dispositivo', value: null }}
          items={dispositivos.map(d => ({
            label: `${d.nome} (${d.mac})`, 
            value: d.mac
          }))}
          onValueChange={(value) => setMacAddress(value)} 
          value={macAddress}
          style={pickerSelectStyles}
        />
      </View>

      <TouchableOpacity 
        style={[styles.btn, {marginTop: 100}]}
        onPress={() => excluirDispositivo()}
      >
        <Text style={styles.btnTexto}>
          Excluir
        </Text>
      </TouchableOpacity>
    </View>
  )
}