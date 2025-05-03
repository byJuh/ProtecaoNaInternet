//Criar uma tela com o nome do grupo -> literalmente só um campo e criar
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../../constants/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/types";
import { useNavigation } from "@react-navigation/native";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Cadastrar_Mac'>;

export default function CadastrarGrupos(){
    
    const navigation = useNavigation<NavigationProps>();
    const [nomeGrupo, setNomeGrupo] = useState("")
    const onChangeNomeGrupoHandler = async (nomeGrupo: string) => setNomeGrupo(nomeGrupo);
    
    const criarGrupo = () => {
        if(nomeGrupo) {
            setNomeGrupo('')
            navigation.navigate('Cadastrar_Mac', {nomeGrupo: nomeGrupo})
        }else{
            Alert.alert("Preencha o campo vazio!!")
            return;
        }
    }

    return(
        <View style={[styles.container, {backgroundColor: '#C8D9E6'}]}>
            <TextInput
                style={[styles.input, {marginBottom: 15}]}
                placeholder={'Nome do Grupo'}
                placeholderTextColor={'#9DB2BF'}
                value={nomeGrupo}
                onChangeText={onChangeNomeGrupoHandler}
            />
            <TouchableOpacity style={[styles.btn, {margin: '10%'}]}
            onPress={() => criarGrupo()}>
                <Text style={styles.btnTexto}>
                    Criar Grupo
                </Text>
            </TouchableOpacity>
        </View>
    )
}