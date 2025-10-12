import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { pickerSelectStyles, styles } from "../../../constants/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../utils/types";
import RNPickerSelect from 'react-native-picker-select';
import { carregarDispositivos, carregarGrupos, deletarGrupo } from "../../../services/salvarDispostivos";
import { useNavigation } from "@react-navigation/native";
import { deleteGroup } from "../../../services/requests";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function ExcluirGrupo(){

  const navigation = useNavigation<NavigationProps>();

  const [grupos, setGrupos] = useState<Map<string,number>>(new Map);
  const [grupo, setGrupo] = useState("");
  
  useEffect(() => {
      async function fetchGrupos() {
        try {
            const gruposSalvos =  carregarGrupos();
              
            if(gruposSalvos != null) {
              setGrupos(gruposSalvos);
            }
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
      const dispositivosSalvos = carregarDispositivos(grupo)
      Alert.alert(dispositivosSalvos ? "Dispositivos encontrados" : "Nenhum dispositivo encontrado")

      if(dispositivosSalvos) {
        const dispositivoMac = dispositivosSalvos.map(d => d.mac)
        Alert.alert(dispositivoMac ? "Macs encontrados" : "Nenhum mac encontrado")

        const response = await deleteGroup(grupo, dispositivoMac)

        if(response){
          deletarGrupo(grupo)
          var mensagem = "Grupo: " + grupo + " foi removido!"
          Alert.alert("Removido", 
            mensagem,
            [
              {text: 'Ok', onPress: async () => {
                  setGrupo('');
                  navigation.replace('Tabs', { screen: 'Bloquear' });
              }}
            ]
          )
      }
       
      }
    }catch(error){
      console.error("Erro ao excluir grupo:", error);
      if (error instanceof Error) {
        Alert.alert("Não foi possível remover!!", error.message);
      } else {
        Alert.alert("Não foi possível remover!!", "Erro desconhecido");
      }
    }
  }},
  {text: 'Não', onPress: () => navigation.replace('Tabs', {screen: 'AdicionarGrupos'})}], {cancelable:false})  
}

  return(
    <View style = {[styles.container, {backgroundColor: '#C8D9E6'}]}>
      <View testID="picker-groups" style = {styles.select}>
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
        accessibilityRole="button"
      >
        <Text style={styles.btnTexto}>
          Excluir
        </Text>
      </TouchableOpacity>
    </View>
  )
}