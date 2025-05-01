import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { pickerSelectStyles, pickerSelectStylesBloquear, styles } from "../../constants/styles";
import RNPickerSelect from 'react-native-picker-select';
import { Dispositivo } from "../../utils/types";
import { carregarDispositivos } from "../../services/salvarMacAddress";

//FAZER UM SELECT DE MAC ADDRESS E MOSTRAR APENAS OS SITES DELE PARA BLOQUEIO
export default function Bloquear(){
    
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
    
    return(
        <SafeAreaView style={[styles.container, {backgroundColor: '#F5EFEB'}]}>

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