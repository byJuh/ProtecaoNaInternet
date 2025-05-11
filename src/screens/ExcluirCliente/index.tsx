import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { pickerSelectStyles, styles } from "../../constants/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dispositivo, GruposDispositivos, RootStackParamList } from "../../utils/types";
import RNPickerSelect from 'react-native-picker-select';
import { carregarDispositivos } from "../../services/salvarDispositivos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { deleteClient } from "../../services/requests";
import getDispositivos from "../../services/useCarregarDispositivos";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
type RouteProps = RouteProp<RootStackParamList, 'Excluir_Mac'>;

export default function Excluir_cliente({ route } : {route: RouteProps}){

  const navigation = useNavigation<NavigationProps>();
  const {nomeGrupo} = route.params;

  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [macAddress, setMacAddress] = useState("");
  
  getDispositivos(nomeGrupo, setDispositivos)
  
  const excluirDispositivo = async() => {
    try{
      if(macAddress){

        const response = await deleteClient(macAddress, nomeGrupo)

        if(response){
          const gruposSalvos = await AsyncStorage.getItem('gruposDispositivos');
        
          if(gruposSalvos){
            let grupos: GruposDispositivos = {};
            if (gruposSalvos) {
              try {
                  grupos = JSON.parse(gruposSalvos);
                  
                  if (Array.isArray(grupos)) {
                      grupos = {};
                  }
              } catch (error) {
                  throw new Error("Erro ao salvar dispostivo");
              }
            }
    
            let dispositivosSalvos = grupos[nomeGrupo].dispositivos.filter((d: Dispositivo) => d.mac !== macAddress)
    
          
            grupos[nomeGrupo] = {
              dispositivos: dispositivosSalvos,
              quantidade: dispositivosSalvos.length
            }
    
            await AsyncStorage.setItem('gruposDispositivos', JSON.stringify(grupos))
            
            var mensagem = "Dispositivo de MAC: " + macAddress + " foi removido!"
            Alert.alert("Removido", mensagem)
    
            navigation.navigate('Tabs', { screen: 'Principal' });
          }
        }
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