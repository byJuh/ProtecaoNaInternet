import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export async function salvarDispositivos(nomeDispositivo: string, macAddressFormatted: string){
    try{
        //pegando o item salvo, caso nao tenha ira ser criado
        const dispositivosSalvos = await AsyncStorage.getItem('dispositivos');
        
        //verifica se tem algo, se tiver transforma em objeto, caso nao transforma em array vazio
        let dispositivos = dispositivosSalvos ? JSON.parse(dispositivosSalvos) : [];

        //verifica se realmente eh um array
        if (!Array.isArray(dispositivos)) dispositivos = [];

        dispositivos.push({ nome: nomeDispositivo, mac: macAddressFormatted });
        await AsyncStorage.setItem('dispositivos', JSON.stringify(dispositivos));
        
        Alert.alert("Sucesso", "Dispositivo salvo!");

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