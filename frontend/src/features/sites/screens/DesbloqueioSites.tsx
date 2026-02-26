import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { pickerSelectStyles, styles } from "../../../constants/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../utils/types";
import RNPickerSelect from 'react-native-picker-select';
import { RouteProp, useNavigation } from "@react-navigation/native";
import getSitesBloqueados from "../services/getSitesBloqueados";
import { deletarSiteDoGrupo } from "../services/salvarSitesBloqueados";
import { unblockDomain } from "../../../services/requests";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
type RouteProps = RouteProp<RootStackParamList, 'Desbloquear_Sites'>;

export default function Desbloquear_Sites({ route } : {route: RouteProps}){

  const navigation = useNavigation<NavigationProps>();
  const {nomeGrupo} = route.params;

  const [sites, setSites] = useState<string[]>([]);
  const[siteSelecionado, setSiteSelecionado] = useState<string>("");
  
  useEffect(() => {
    getSitesBloqueados(nomeGrupo, setSites)
  }, [])
  
  //logica de exclusao de site bloqueado
  const desboquearSites = async() => {
    try{
      if(siteSelecionado){
        //remover site da lista de sites bloqueados
        const response = await unblockDomain(nomeGrupo, siteSelecionado);

        if(!response){
          Alert.alert("Não foi possível desbloquear o site!!")
          return;
        }

        deletarSiteDoGrupo(nomeGrupo, siteSelecionado);

        Alert.alert("Desbloqueado", response)

        navigation.replace('Lista_De_Bloqueio');
      }
    }catch(error){
        //console.error(error)
        Alert.alert("Não foi possível desbloquear o site!!")
    }
  }

  return(
    <View style = {[styles.container, {backgroundColor: '#C8D9E6'}]}>
      <View testID="picker-dispositivo" style = {styles.select}>
        <RNPickerSelect 
          placeholder={{ label: 'Selecione um site', value: null }}
          items={sites.map(d => ({
            label: `${d}`, 
            value: d
          }))}
          onValueChange={(value) => setSiteSelecionado(value)} 
          value={siteSelecionado}
          style={pickerSelectStyles}
        />
      </View>

      <TouchableOpacity 
        style={[styles.btn, {marginTop: 100}]}
        onPress={() => desboquearSites()}
        accessibilityRole="button"
      >
        <Text style={styles.btnTexto}>
          Desbloquear
        </Text>
      </TouchableOpacity>
    </View>
  )
}

