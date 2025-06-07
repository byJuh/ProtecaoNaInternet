//Criar uma tela com o nome do grupo -> literalmente só um campo e criar
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../../constants/styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/types";
import { useNavigation } from "@react-navigation/native";
import { carregarGrupos } from "../../services/salvarDispostivos";
import { createGroup } from "../../services/requests";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Cadastrar_Mac'>;

export default function CadastrarGrupos(){
    
    const navigation = useNavigation<NavigationProps>();
    const [nomeGrupo, setNomeGrupo] = useState("")
    const onChangeNomeGrupoHandler = async (nomeGrupo: string) => setNomeGrupo(nomeGrupo);
    
    //COLOCAR TRY-CATCH
    const criarGrupo = async () => {
        if(nomeGrupo != '') {
            try{
                const grupo = carregarGrupos()

                if(grupo && !grupo.has(nomeGrupo)) {
                    const response = await createGroup(nomeGrupo)

                    if(response){
                        //console.error(response)
                        Alert.alert(response)
                        navigation.replace('Cadastrar_Mac', {nomeGrupo: nomeGrupo})
                    }
                    
                }else{
                    Alert.alert("Esse grupo já existe!!")
                    return;
                }
                
            }catch(error){
                if(error instanceof Error) {
                    Alert.alert("Erro", error.message);
                }
            }
            
        }else{
            Alert.alert("Preencha o campo vazio!!")
            return;
        }
    }

    return(
        <View style={[styles.container, {backgroundColor: '#C8D9E6'}]}>
            <TextInput
                style={[styles.input, {marginBottom: 15,  color:'#9DB2BF'}]}
                placeholder={'Nome do Grupo'}
                placeholderTextColor={'#9DB2BF'}
                value={nomeGrupo}
                onChangeText={onChangeNomeGrupoHandler}
                testID="input-nomeGrupo"
            />
            <TouchableOpacity style={[styles.btn, {margin: '10%'}]}
                onPress={() => criarGrupo()}
                accessibilityRole="button"
            >
                <Text style={styles.btnTexto}>
                    Criar Grupo
                </Text>
            </TouchableOpacity>
        </View>
    )
}