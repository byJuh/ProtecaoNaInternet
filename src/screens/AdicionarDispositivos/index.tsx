import React, { useEffect, useState } from "react";
import { Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../constants/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/types";
import { carregarDispositivos } from "../../services/salvarDispositivos";
import { Dispositivo } from "../../utils/types";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function AdicionarMacAddress(){

    const navigation = useNavigation<NavigationProps>();

    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);

    //roda toda vez que entrar na tela
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

                <View style={{flexDirection: 'row', height: '100%'}}>
                    <TouchableOpacity 
                        style={[styles.btn, {marginTop: 50, backgroundColor: '#2F4156'}]} 
                        onPress={() => navigation.navigate('Cadastrar_Mac')}
                    >
                        <Text style={styles.btnTexto}>
                            Novo MAC
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.btn, {marginTop: 50, backgroundColor: '#2F4156', marginLeft: 10}]} 
                        onPress={() => navigation.navigate('Excluir_Mac')}
                    >
                        <Text style={styles.btnTexto}>
                            Excluir Mac
                        </Text>
                    </TouchableOpacity>
                </View>
               
            </View>
        </SafeAreaView>

    )
}