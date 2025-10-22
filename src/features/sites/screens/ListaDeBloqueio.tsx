import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../../constants/styles";
import { RootStackParamList } from "../../../utils/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import getGruposComQuantidadesDeSitesBloqueados from "../services/getGruposComQtdSites";

type navigationProps = NativeStackNavigationProp<RootStackParamList, 'Desbloquear_Sites'>;

export default function ListaDeGruposComSites(){
    
      const navigation = useNavigation<navigationProps>();
   
       const [grupos, setGrupos] = useState<[string, number][]>([]);
   
       //roda toda vez que entrar na tela
       useEffect(() => {
          getGruposComQuantidadesDeSitesBloqueados(setGrupos);
       }, [])
       
       const renderItem = ({ item }: { item: [string, number] }) => (
           <TouchableOpacity style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
               onPress={() => navigation.replace('Desbloquear_Sites', {nomeGrupo: item[0]})}
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
                           testID="visualizar-grupos-sites-bloqueados"
                           data={grupos}
                           renderItem={renderItem}
                           keyExtractor={([nome]) => nome}
                           ListEmptyComponent={<Text>Nenhum dispositivo cadastrado.</Text>}
                       />
                   </SafeAreaView>
               </View>
           </SafeAreaView>
   
    );
}