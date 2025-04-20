import React, { useEffect, useState } from "react";
import { Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../constants/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Dispositivo = {
    nome: string;
    mac: string;
};

export default function AdicionarMacAddress(){
    const [dispositivos, setDispositivos] = useState([]);

    //roda toda vez que entrar na tela
    useEffect(() => {
        async function fetchDispositivos(){
            try{
                const dispotivosSalvos = await AsyncStorage.getItem('dispositivos')
                 
                if(dispotivosSalvos) {
                    setDispositivos(JSON.parse(dispotivosSalvos)) 
                }
            }catch(error){
                console.error("Erro ao carregar dispositivos:", error);
                Alert.alert("Erro", "Não foi possível carregar os dispositivos");
            }
            
        } 
        fetchDispositivos(); 
    }, []);

    const renderItem = ({ item }: { item: Dispositivo }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text style={{ fontWeight: 'bold' }}>{item.nome}</Text>
            <Text>{item.mac}</Text>
        </View>
      );

    return(
        <SafeAreaView style={[styles.container, {backgroundColor: '#F5EFEB'}]}>
            <View style={{ flex: 1, alignItems: 'center', width: '100%', paddingTop: 20}}>
                <SafeAreaView style={styles.spaceContainerAddBlock}>
                <FlatList
                    data={dispositivos}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<Text>Nenhum dispositivo cadastrado.</Text>}
                />
                </SafeAreaView>

                <TouchableOpacity style={[styles.btn, {marginTop: 50, backgroundColor: '#2F4156'}]}>
                    <Text style={styles.btnTexto}>
                        Novo MAC
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>

    )
}