import React, { useEffect, useState } from "react";
import { Alert, FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../constants/styles";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/types";
import { Dispositivo } from "../../utils/types";
import getDispositivos from "../../services/useCarregarDispositivos";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
type RouteProps = RouteProp<RootStackParamList, 'Adicionar_Dispositivo'>;

export default function AdicionarDispositivos({ route } : {route: RouteProps}){

    const navigation = useNavigation<NavigationProps>();
    const {nomeGrupo} = route.params;

    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);

    //roda toda vez que entrar na tela
    useEffect(() => {
        getDispositivos(nomeGrupo, setDispositivos)
    }, [])
    

    const renderItem = ({ item }: { item: Dispositivo }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 22}}>{item.nome}</Text>
            <Text style={{ fontSize: 20}}>{'\t'}{item.mac}</Text>
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
                        onPress={() => navigation.replace('Cadastrar_Mac', {nomeGrupo})}
                    >
                        <Text style={styles.btnTexto}>
                            Novo MAC
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.btn, {marginTop: 50, backgroundColor: '#2F4156', marginLeft: 10}]} 
                        onPress={() => navigation.replace('Excluir_Mac', {nomeGrupo})}
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