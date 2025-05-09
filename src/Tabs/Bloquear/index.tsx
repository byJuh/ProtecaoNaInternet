import React, { useEffect, useState } from "react";
import { Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { pickerSelectStylesBloquear, styles } from "../../constants/styles";
import RNPickerSelect from 'react-native-picker-select';
import { Dispositivo, Registro } from "../../utils/types";
import fetchGrupos from "../../services/useCarregarGrupos";
import fetchDispositivos from "../../services/useCarregarDispositivos";
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import pegandoRegistros from "../../services/useCarregarListaDeSites";
import { addDomainBlocklist } from "../../services/requests";

export default function Bloquear(){
    
    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
    const [grupos, setGrupos] = useState<Map<string,number>>(new Map());
    const [macAddress, setMacAddress] = useState("");
    const [grupoSelecionado, setGruposSelecionados] = useState("");
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [selectedValues, setSelectedValues] = useState("");

    fetchGrupos(setGrupos, setGruposSelecionados);
    
    useEffect(() => {
        fetchDispositivos(grupoSelecionado, setMacAddress, setDispositivos);
    }, [grupoSelecionado])
        
   useEffect(() => {
      if(!macAddress) return;
    
      const interval = setInterval(() => {
        pegandoRegistros(setRegistros, macAddress)
      }, 120000)
    
      pegandoRegistros(setRegistros, macAddress)
    
      return () => clearInterval(interval)
    }, [macAddress, grupoSelecionado])

    useEffect(() => {
      console.error("Valores selecionados:", selectedValues);
  }, [selectedValues]);
  
    const pegandoValores = (domain: string, isChecked: boolean) => {
      /** if(isChecked){
        selectedValues.push(domain)
        setSelectedValues(selectedValues)
      }else{
        const values = selectedValues.filter((x) => x !== domain)
        setSelectedValues(values)
      }
      */

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
            onPress={(isChecked: boolean) => pegandoValores (item.domain, isChecked)}
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

      if(response) Alert.alert(`Site ${selectedValues} bloqueado com sucesso!!`)
    }
    
    return(
      <SafeAreaView style={[styles.container, {backgroundColor: '#F5EFEB'}]}>
        <View style = {[styles.select, {marginTop: 15, width: '50%', borderWidth: 2, borderColor: '#567C8D'}]}>
          <RNPickerSelect 
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
    
                <TouchableOpacity 
                    style={[styles.btn, {marginTop: 50, backgroundColor: '#2F4156'}]} 
                    onPress={() => bloquearSites()}
                >
                    <Text style={styles.btnTexto}>
                        Bloquear
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    
    )
}