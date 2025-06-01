import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { pickerSelectStylesBloquear, styles } from "../../constants/styles";
import RNPickerSelect from 'react-native-picker-select';
import { Dispositivo, Registro } from "../../utils/types";
import fetchGrupos from "../../services/useCarregarGrupos";
import fetchDispositivos from "../../services/useCarregarDispositivosMacAddress";
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import pegandoRegistros from "../../services/useCarregarListaDeSites";
import { addDomainBlocklist } from "../../services/requests";
import { useFocusEffect } from "@react-navigation/native";

export default function Bloquear({ onSelecionarDominio }: { onSelecionarDominio?: (domain: string) => void }){
    
    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
    const [grupos, setGrupos] = useState<Map<string,number>>(new Map());
    const [macAddress, setMacAddress] = useState("");
    const [grupoSelecionado, setGruposSelecionados] = useState("");
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [selectedValues, setSelectedValues] = useState("");
    

    //Select com os grupos, pegando os grupos. Se tiver só um, seleciona direto o grupo
    useEffect(() => {
      fetchGrupos(setGrupos, setGruposSelecionados);
    }, []) 
    
    //Select com os dispositivos. Se tiver só um, seleciona direto o dispostivo, salvando o mac
    useEffect(() => {
        fetchDispositivos(grupoSelecionado, setMacAddress, setDispositivos);
      }, [grupoSelecionado])
        
    //rodar daqui 4 min
    useFocusEffect(
      useCallback(() => {
          const controller = new AbortController();
          const signal = controller.signal;

          if(!macAddress || grupos.size === 0) return;
                   
          pegandoRegistros(setRegistros, macAddress, signal);
          
          const interval = setInterval(() => {
            pegandoRegistros(setRegistros, macAddress, signal);
          }, 120000)
        
          return () => {
            //limpa o tempo, nn fazendo com que realize o comando de get a cada 4 min
            clearInterval(interval);

            //aborta o fetch, para que, ao sair a tela de foco, nn continue a realização de getRegistro
            controller.abort();
            
            //limpa os campos
            setRegistros([]);
            setMacAddress("");
            setGruposSelecionados("");
            setSelectedValues("");
          }
        }, [macAddress, grupoSelecionado])
    );
     
    //salva o valor selecionado
    const pegandoValores = (domain: string) => {
      setSelectedValues(domain)
      if (onSelecionarDominio) onSelecionarDominio(domain); 
    }
    //como os dados vao ser mostrado no FlatList
    const renderItem = ({ item }: { item: Registro }) => (
      <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection: 'row'}}>
          <BouncyCheckbox
            testID={`checkbok-domain-${item.domain}`}
            size={22}
            fillColor="#2F4156"
            unFillColor="#FFFFFF"
            text={item.domain}
            innerIconStyle={{ borderWidth: 2 }}
            onPress={() => pegandoValores (item.domain)}
            isChecked={selectedValues === item.domain}
          />
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
            {item.domain}
          </Text>
      </View>
    ); 

    //Serve para bloquear os sites
    const bloquearSites = async () => {
      //console.error(selectedValues) 
      const response = await addDomainBlocklist(selectedValues, grupoSelecionado)

      if(response) {
        Alert.alert(response)

        //salvo no MMKV
      }
    }

    const excluirSites = async () => {
      //Passar para uma tela de selecionar um grupo e um dos dominios!!
    }
    
    return(
      <SafeAreaView style={[styles.container, {backgroundColor: '#F5EFEB'}]}>
        <View style = {[styles.select, {marginTop: 15, width: '50%', borderWidth: 2, borderColor: '#567C8D'}]}
              testID="picker-groups"
        >
          <RNPickerSelect
            items={Array.from(grupos.keys()).map(nomeGrupo => ({
              label: nomeGrupo,
              value: nomeGrupo
            }))}
            onValueChange={(value) => setGruposSelecionados(value)} 
            value={grupoSelecionado}
            style={pickerSelectStylesBloquear}
            placeholder={{ label: 'Grupos', value: null }}
          />
        </View>
        {grupos && grupoSelecionado && (
          <View style = {[styles.select, {marginTop: 15, width: '50%', borderWidth: 2, borderColor: '#567C8D'}]}
                testID="picker-dispositivos"
          >
            <RNPickerSelect 
              placeholder={{ label: 'Dispositivos', value: null }}
              items={dispositivos.map(d => ({
                label: `${d.nome} (${d.mac})`, 
                value: d.mac 
              }))}
              onValueChange={(value) => setMacAddress(value)} 
              value={macAddress}
              style={pickerSelectStylesBloquear}
            />
          </View>
        )}
        <View style={{ flex: 1, alignItems: 'center', width: '100%', paddingTop: 20}}>
          <SafeAreaView style={styles.spaceContainerAddBlock}>
            <FlatList 
              testID="visualizacao-dominios"
              data={registros} 
              renderItem={renderItem}
              ListEmptyComponent={<Text style={{fontSize: 20, alignSelf: "center"}}> Selecione um grupo e um dispositivo </Text>}              
            />
          </SafeAreaView>

          <View style={{flexDirection: 'row', height: '100%'}}>
            <TouchableOpacity 
              style={[styles.btn, {marginTop: '5%', backgroundColor: '#2F4156', height: '10%'}]} 
              onPress={() => bloquearSites()}
              accessibilityRole="button"
            >
              <Text style={styles.btnTexto}>
                Bloquear
              </Text>
            </TouchableOpacity>
          </View>       
        </View>
      </SafeAreaView>
    );
}