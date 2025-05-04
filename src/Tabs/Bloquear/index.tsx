import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { pickerSelectStylesBloquear, styles } from "../../constants/styles";
import RNPickerSelect from 'react-native-picker-select';
import { Dispositivo } from "../../utils/types";
import { carregarDispositivos, carregarGrupos } from "../../services/salvarDispositivos";

export default function Bloquear(){
    
    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
    const [grupos, setGrupos] = useState<Map<string,number>>(new Map);
    const [macAddress, setMacAddress] = useState("");
    const [grupoSelecionado, setGruposSelecionados] = useState("");
      
    useEffect(() => {
            async function fetchGrupos() {
              try {
                const gruposSalvos = await carregarGrupos();
    
                if(gruposSalvos != null) setGrupos(gruposSalvos)
              } catch (error: unknown) {
                  if (error instanceof Error) {  
                    Alert.alert("Erro", error.message);
                  }
              }
            }
            fetchGrupos();
        }, []);
    
        useEffect(() => {
          async function fetchDispositivos() {
            try{
              if(grupoSelecionado != null) {
                const dispositivosSalvos = await carregarDispositivos(grupoSelecionado);
                        
                if(dispositivosSalvos != null) setDispositivos(dispositivosSalvos);
              }
            } catch (error: unknown) {
                if (error instanceof Error) {  
                  Alert.alert("Erro", error.message);
                }
            }
          }
          fetchDispositivos();
        }, [grupoSelecionado])
    
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
          {grupoSelecionado && (
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
                    
                </SafeAreaView>
    
                <TouchableOpacity 
                    style={[styles.btn, {marginTop: 50, backgroundColor: '#2F4156'}]} 
                    onPress={() => Alert.alert("Bloqueados!!")}
                >
                    <Text style={styles.btnTexto}>
                        Bloquear
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    
    )
}