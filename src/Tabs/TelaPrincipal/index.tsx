import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { pickerSelectStylesBloquear, styles } from "../../constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dispositivo, Registro } from "../../utils/types";
import RNPickerSelect from 'react-native-picker-select';

export default function TelaPrincipal(){

    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
    const [grupos, setGrupos] = useState<Map<string,number>>(new Map());
    const [macAddress, setMacAddress] = useState("");
    const [grupoSelecionado, setGruposSelecionados] = useState("");
    const [registros, setRegistros] = useState<Registro[]>([]);

  
    const escolhendoGrupos = async (value: string) => {setGruposSelecionados(value)}

    const renderItem = ({ item }: { item: Registro }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 22}}>{item.domain}</Text>
          </View>
    );
     
    return(
        <SafeAreaView style={[styles.container, {backgroundColor: '#F5EFEB'}]}>

          <View style = {[styles.select, {marginTop: 15, width: '50%', borderWidth: 2, borderColor: '#567C8D'}]}>
                <RNPickerSelect 
                    placeholder={{ label: 'Grupos', value: null }}
                    items={Array.from(grupos.keys()).map(nomeGrupo => ({
                      label: nomeGrupo,
                      value: nomeGrupo
                    }))}
                    onValueChange={(value) => escolhendoGrupos(value)} 
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
                  onValueChange={(value) => {
                    setMacAddress(value) 
                    if(!macAddress) setRegistros([])
                  }}
                  value={macAddress}
                  style={pickerSelectStylesBloquear}
                />
            </View>
          )}
        
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <SafeAreaView style={styles.spaceContainer}>
                <FlatList 
                  data={registros} 
                  renderItem={renderItem}  
                  ListEmptyComponent={<Text style={{fontSize: 20, alignSelf: "center"}}> Selecione um grupo e um dispositivo </Text>}              
              />
            </SafeAreaView>
          </View>

        </SafeAreaView>
    )
}
