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

export default function Bloquear(){
    
    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
    const [grupos, setGrupos] = useState<Map<string,number>>(new Map());
    const [macAddress, setMacAddress] = useState("");
    const [grupoSelecionado, setGruposSelecionados] = useState("");
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [selectedValues, setSelectedValues] = useState("");
    
    useEffect(() => {
      fetchGrupos(setGrupos, setGruposSelecionados);
    }, []) 
    
    useEffect(() => {
        fetchDispositivos(grupoSelecionado, setMacAddress, setDispositivos);
    }, [grupoSelecionado])
        
    //rodar daqui 4 min
    useFocusEffect(
      useCallback(() => {
          if(!macAddress ||  grupos.size === 0) return;
        
          pegandoRegistros(setRegistros, macAddress);
          
          const interval = setInterval(() => {
            pegandoRegistros(setRegistros, macAddress)
          }, 120000)
        
          return () => {
            clearInterval(interval);
            setRegistros([])
            setMacAddress("")
            setGruposSelecionados("")
            setSelectedValues("")
          }
        }, [macAddress, grupoSelecionado])
    )
     
  
    const pegandoValores = (domain: string) => {
      setSelectedValues(domain)
    }

    const renderItem = ({ item }: { item: Registro }) => (
      <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection: 'row'}}>
          <BouncyCheckbox
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

    const bloquearSites = async () => {
      console.error(selectedValues)
      const response = await addDomainBlocklist(selectedValues, grupoSelecionado)

      if(response) Alert.alert(response)
    }

    const excluirSites = async () => {
      //Passar para uma tela de selecionar um grupo e um dos dominios!!
    }
    
    return(
      <SafeAreaView style={[styles.container, {backgroundColor: '#F5EFEB'}]}>
        <View style = {[styles.select, {marginTop: 15, width: '50%', borderWidth: 2, borderColor: '#567C8D'}]}>
          <RNPickerSelect 
            touchableWrapperProps={{testID: 'picker-grupos'}}
            placeholder={{ label: 'Grupos', value: null }}
            items={Array.from(grupos.keys()).map(nomeGrupo => ({
              label: nomeGrupo,
              value: nomeGrupo
            }))}
            onValueChange={(value) => setGruposSelecionados(value)} 
            value={grupoSelecionado}
            style={pickerSelectStylesBloquear}
          />
        </View>
        {grupos && grupoSelecionado && (
          <View style = {[styles.select, {marginTop: 15, width: '50%', borderWidth: 2, borderColor: '#567C8D'}]}>
            <RNPickerSelect 
              touchableWrapperProps={{testID: 'picker-dispositivos'}}
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
                      data={registros} 
                      renderItem={renderItem}
                      ListEmptyComponent={<Text style={{fontSize: 20, alignSelf: "center"}}> Selecione um grupo e um dispositivo </Text>}              
                    />
                </SafeAreaView>

                <View style={{flexDirection: 'row', height: '100%'}}>
                  <TouchableOpacity 
                      style={[styles.btn, {marginTop: '5%', backgroundColor: '#2F4156', height: '10%'}]} 
                      onPress={() => bloquearSites()}
                  >
                      <Text style={styles.btnTexto}>
                          Bloquear
                      </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                      style={[styles.btn, {marginTop: '5%', backgroundColor: '#2F4156', marginLeft: 10, height: '10%'}]} 
                      onPress={() => excluirSites()}
                  >
                      <Text style={styles.btnTexto}>
                          Excluir bloqueio
                      </Text>
                  </TouchableOpacity>
                </View>
                
            </View>
        </SafeAreaView>
    
    )
}