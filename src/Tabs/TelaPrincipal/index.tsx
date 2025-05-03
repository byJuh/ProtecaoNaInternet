import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { pickerSelectStylesBloquear, styles } from "../../constants/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { carregarDispositivos } from "../../services/salvarDispositivos";
import { Dispositivo, Registro } from "../../utils/types";
import RNPickerSelect from 'react-native-picker-select';
import { getRegistro } from "../../services/requests";

//MUDAR PARA FLATLIST TALVEZ (COM SEPARACAO)
export default function TelaPrincipal(){

    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
    const [macAddress, setMacAddress] = useState("");
    const [registros, setRegistros] = useState<Registro[]>([]);

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

    const pegandoRegistros = async (value: string) => {
      setMacAddress(value);

      //realizar request
      try{
        const response = await getRegistro(macAddress);
        setRegistros(response);

      }catch (error: unknown) {
          if (error instanceof Error) {
            Alert.alert("Erro", error.message);
          } 
      }
    }
        
    return(
        <SafeAreaView style={[styles.container, {backgroundColor: '#F5EFEB'}]}>

          <View style = {[styles.select, {marginTop: 15, width: '50%', borderWidth: 2, borderColor: '#567C8D'}]}>
                <RNPickerSelect 
                    placeholder={{ label: 'Dispositivos', value: null }}
                    items={dispositivos.map(d => ({
                        label: `${d.nome} (${d.mac})`, 
                        value: d.mac
                    }))}
                    onValueChange={(value) => pegandoRegistros(value)} 
                    value={macAddress}
                    style={pickerSelectStylesBloquear}
                />
          </View>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <SafeAreaView style={styles.spaceContainer}>
      
            </SafeAreaView>
          </View>

        </SafeAreaView>
    )
}
