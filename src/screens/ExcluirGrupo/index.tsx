import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { pickerSelectStyles, styles } from "../../constants/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dispositivo, GruposDispositivos, RootStackParamList } from "../../utils/types";
import RNPickerSelect from 'react-native-picker-select';
import { carregarDispositivos, carregarGrupos } from "../../services/salvarDispositivos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { deleteGroup } from "../../services/requests";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function ExcluirGrupo(){

  const navigation = useNavigation<NavigationProps>();

  const [grupos, setGrupos] = useState<Map<string,number>>(new Map);
  const [grupo, setGrupo] = useState("");
  
  useEffect(() => {
      async function fetchGrupos() {
        try {
            const gruposSalvos = await carregarGrupos();
              
            if(gruposSalvos != null) setGrupos(gruposSalvos);
          
        } catch (error: unknown) {
            if (error instanceof Error) {
              Alert.alert("Erro", error.message);
            }
          }
        }
      fetchGrupos();
  }, []);

  const excluirDispositivo = async() => {
    Alert.alert(
      'Confirmação',
      `Tem certeza que deseja excluir o grupo: ${grupo}? \n
       Irá excluir os dispositivos também!!`,
    [
    {text: 'Sim', onPress: async() => {
    try{ 
      const response = await deleteGroup(grupo)

      if(response){
          const gruposSalvos = await AsyncStorage.getItem('gruposDispositivos');

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
          delete grupos[grupo]
          await AsyncStorage.setItem('gruposDispositivos', JSON.stringify(grupos))
                      
          var mensagem = "Grupo: " + grupo + " foi removido!"
          Alert.alert("Removido", 
            mensagem,
            [
              {text: 'Ok', onPress: async () => {
                if(!grupos[grupo]){
                  setGrupo('');
                  navigation.navigate('Tabs', { screen: 'Principal' });
                }
              }}
            ]
          )
       
      }
    }catch(error){
      Alert.alert("Não foi possível remover!!")
    }
  }},
  {text: 'Não', onPress: () => navigation.navigate('Tabs', {screen: 'AdicionarGrupos'})}], {cancelable:false})
      
}

  return(
    <View style = {[styles.container, {backgroundColor: '#C8D9E6'}]}>
      <View style = {styles.select}>
        <RNPickerSelect 
          placeholder={{ label: 'Selecione um grupos', value: null }}
          items={Array.from(grupos.keys()).map(nomeGrupo => ({
            label: nomeGrupo,
            value: nomeGrupo
          }))}
          onValueChange={(value) => setGrupo(value)} 
          value={grupo}
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