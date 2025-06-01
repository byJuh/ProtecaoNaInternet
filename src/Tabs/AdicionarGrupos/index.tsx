import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/types";
import getGruposQtdDispositivos from "../../services/useCarregarGruposEQtd";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function AdicionarGrupos(){

    const navigation = useNavigation<NavigationProps>();

    const [grupos, setGrupos] = useState<[string, number][]>([]);

    //roda toda vez que entrar na tela
    useEffect(() => {
        getGruposQtdDispositivos(setGrupos)
    }, [])
    
    const renderItem = ({ item }: { item: [string, number] }) => (
        <TouchableOpacity style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
            onPress={() => navigation.navigate('Adicionar_Dispositivo', {nomeGrupo: item[0]})}
            accessibilityRole="button"
        >
            <Text style={{ fontWeight: 'bold', fontSize: 22}}>{item[0]}</Text>
            <Text style={{ fontSize: 20}}>{'\t\t'} quantidade: {item[1]}</Text>
        </TouchableOpacity>
    );

    return(
        <SafeAreaView style={[styles.container, {backgroundColor: '#F5EFEB'}]}>
            <View style={{ flex: 1, alignItems: 'center', width: '100%', paddingTop: 20}}>
                <SafeAreaView style={styles.spaceContainerAddBlock}>
                    <FlatList
                        testID="visualizar-grupos"
                        data={grupos}
                        renderItem={renderItem}
                        keyExtractor={([nome]) => nome}
                        ListEmptyComponent={<Text>Nenhum dispositivo cadastrado.</Text>}
                    />
                </SafeAreaView>

                <View style={{flexDirection: 'row', height: '100%'}}>
                    <TouchableOpacity 
                        accessibilityRole="button"
                        style={[styles.btn, {marginTop: 50, backgroundColor: '#2F4156'}]} 
                        onPress={() => navigation.navigate('Cadastrar_Grupo')}
                    >
                        <Text style={styles.btnTexto}>
                            Novo Grupo
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.btn, {marginTop: 50, backgroundColor: '#2F4156', marginLeft: 10}]} 
                        onPress={() => navigation.navigate('Excluir_Grupo')}
                        accessibilityRole="button"
                    >
                        <Text style={styles.btnTexto}>
                            Excluir Grupo
                        </Text>
                    </TouchableOpacity>
                </View>
               
            </View>
        </SafeAreaView>

    )
}