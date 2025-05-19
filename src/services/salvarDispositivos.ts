import AsyncStorage from "@react-native-async-storage/async-storage";
import { GruposDispositivos } from "../utils/types";

export async function salvarDispositivos(nomeDispositivo: string, macAddressFormatted: string, nomeGrupo: string){
    try{
        //pegando o item salvo, caso nao tenha ira ser criado
        const gruposSalvos = await AsyncStorage.getItem('gruposDispositivos');
        
        //verifica se tem algo, se tiver transforma em objeto, caso nao transforma em array vazio
        let grupos: GruposDispositivos = {};
        try{
            grupos = gruposSalvos ? JSON.parse(gruposSalvos) : {};
        }catch(error){
            throw new Error("Erro ao salvar dispositivo");
        }

        if(!grupos[nomeGrupo]) {
            grupos[nomeGrupo] = {
                quantidade: 0,
                dispositivos: []
            };
        }

        grupos[nomeGrupo].dispositivos.push({ 
            nome: nomeDispositivo, 
            mac: macAddressFormatted 
        });
        grupos[nomeGrupo].quantidade = grupos[nomeGrupo].dispositivos.length;

        await AsyncStorage.setItem('gruposDispositivos', JSON.stringify(grupos));
        

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
export async function carregarDispositivos(nomeGrupo: string): Promise<Dispositivo[]>  {
    try{
        let dispositivosSalvos = await AsyncStorage.getItem('gruposDispositivos')
        const grupos: GruposDispositivos = dispositivosSalvos ? JSON.parse(dispositivosSalvos) : {};

        if(!grupos[nomeGrupo] || !grupos[nomeGrupo].dispositivos) return [];
        
        const dispositivos: Dispositivo[] = grupos[nomeGrupo].dispositivos

        return dispositivos
    }catch(error){
        throw new Error("Erro ao carregar os dispositivos.");
    }
            
} 

export async function carregarGrupos(): Promise<Map<string, number>> {
    try{
        const gruposSalvos = await AsyncStorage.getItem('gruposDispositivos')
        
                 
        var gruposSalvosObject = gruposSalvos ? JSON.parse(gruposSalvos) : {};

        var gruposMap = new Map(Object.entries(gruposSalvosObject));
        var resultadosMap = new Map();


        for (const key of gruposMap.keys()) {
            var quantidade = (gruposMap.get(key) as {quantidade: number}).quantidade
            resultadosMap.set(key, quantidade);
        }

        return resultadosMap

    }catch(error){
        throw new Error("Erro ao carregar grupos.");
    }
            
} 