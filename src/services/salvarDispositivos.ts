import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export async function salvarDispositivos(nomeDispositivo: string, macAddressFormatted: string, nomeGrupo: string){
    try{
        //pegando o item salvo, caso nao tenha ira ser criado
        const gruposSalvos = await AsyncStorage.getItem('gruposDispositivos');
        
        //verifica se tem algo, se tiver transforma em objeto, caso nao transforma em array vazio
        let grupos = gruposSalvos ? JSON.parse(gruposSalvos) : [];

        //verifica se realmente eh um array
        if(!grupos[nomeGrupo]) grupos[nomeGrupo] =[]

        grupos[nomeGrupo].push({ nome: nomeDispositivo, mac: macAddressFormatted });
        await AsyncStorage.setItem('gruposDispositivos', JSON.stringify(grupos));
        
        Alert.alert("Sucesso", "Dispositivo salvo no grupo!");

    }catch (error){
        throw new Error("Erro ao salvar dispostivo");
    }
}

type Dispositivo = {
    nome: string;
    mac: string;
};

//Promise: Objeto que representa a Completion ou Failure de uma operação assíncrona
//Usada para lidar com tarefas que levam tempo para serem concluídas
export async function carregarDispositivos(): Promise<Dispositivo[]> {
    try{
        let dispositivosSalvos = await AsyncStorage.getItem('dispositivos')
                 
        return dispositivosSalvos ? JSON.parse(dispositivosSalvos) : []
    }catch(error){
        throw new Error("Erro ao carregar os dispositivos.");
    }
            
} 