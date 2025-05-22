import { MMKVLoader } from 'react-native-mmkv-storage';
import { Dispositivo, Grupo, GruposDispositivos } from "../utils/types";
import { Alert } from 'react-native';

const MMKV = new MMKVLoader().initialize();

export function salvarDispositivos(nomeDispositivo: string, macAddressFormatted: string, nomeGrupo: string){
    try{
        //pegando o item salvo, caso nao tenha ira ser criado
        const gruposSalvos = MMKV.getString('gruposDispositivos')
        
        let grupos: GruposDispositivos = gruposSalvos ? JSON.parse(gruposSalvos) : {};
    
        console.error('Dados antes:', JSON.stringify(grupos, null, 2));
        
        //cria um grupo se nn exister
        if(!grupos[nomeGrupo]) {
            grupos[nomeGrupo] = {
                quantidade: 0,
                dispositivos: []
            };
        } 

        //adicionar novo dispostivo -> verificando se ele ja nn existe no grupo
        if(grupos[nomeGrupo].dispositivos.some((dispositivo: Dispositivo) => dispositivo.mac === macAddressFormatted)){
            Alert.alert("Erro", "Esse dispositivo ja esta salvo no grupo!!");
            return;
        }

        grupos[nomeGrupo].dispositivos.push({ 
            nome: nomeDispositivo, 
            mac: macAddressFormatted 
        });
        grupos[nomeGrupo].quantidade = grupos[nomeGrupo].dispositivos.length;

        MMKV.setString('gruposDispositivos', JSON.stringify(grupos));

        const salvou = MMKV.getAllMMKVInstanceIDs();
        console.error('Dados depois:', MMKV.getString('gruposDispositivos')); // Verificação
        console.error(salvou); 
    }catch (error){
        throw new Error("Erro ao salvar dispostivo");
    }
}

export function deletarDispositivo(nomeDispositivo: string, macAddressFormatted: string, nomeGrupo: string){
    try{
        //pegando o item salvo, caso nao tenha ira ser criado
        const gruposSalvos = MMKV.getString('gruposDispositivos');
        
        if(gruposSalvos) {
            const grupos: GruposDispositivos = JSON.parse(gruposSalvos);
        
            if(grupos){
                if(grupos[nomeGrupo]){
                    const index = grupos[nomeGrupo].dispositivos.findIndex(
                        (dispositivos: Dispositivo) => 
                            dispositivos.mac === macAddressFormatted && dispositivos.nome == nomeDispositivo
                    )

                    if(index != -1){
                        grupos[nomeGrupo].dispositivos.splice(index, 1)
                        grupos[nomeGrupo].quantidade = grupos[nomeGrupo].dispositivos.length

                        MMKV.setString('gruposDispositivos', JSON.stringify(grupos));
                    }
                }
            }
        }
    }catch (error){
        throw new Error("Erro ao salvar dispostivo");
    }
}

//Promise: Objeto que representa a Completion ou Failure de uma operação assíncrona
//Usada para lidar com tarefas que levam tempo para serem concluídas
export function carregarDispositivos(nomeGrupo: string): Dispositivo[]  {
    try{
        const dispositivosSalvos = MMKV.getString('gruposDispositivos')
        const grupos: GruposDispositivos = dispositivosSalvos ? JSON.parse(dispositivosSalvos) : {};

        if(!grupos[nomeGrupo] || !grupos[nomeGrupo].dispositivos) return [];
        
        const dispositivos: Dispositivo[] = grupos[nomeGrupo].dispositivos

        return dispositivos
    }catch(error){
        throw new Error("Erro ao carregar os dispositivos.");
    }
            
} 

export function carregarGrupos(): Map<string, number> {
    try{
        const gruposSalvos = MMKV.getString('gruposDispositivos')
        
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


export function deletarGrupo(nomeGrupo: string) {
    try{
       const gruposSalvos = MMKV.getString('gruposDispositivos');
       console.error(gruposSalvos)
       const grupos: GruposDispositivos = gruposSalvos ? JSON.parse(gruposSalvos) : {};

       if(grupos[nomeGrupo]){
           delete grupos[nomeGrupo]
           
           MMKV.setString('gruposDispositivos', JSON.stringify(grupos))
           console.error(grupos)
        }
    } catch(error){
        throw new Error("Erro ao deletar grupo.");
    }
}

export function verificarQuantidadeGrupos(): boolean {
     try{
       const gruposSalvos = MMKV.getString('gruposDispositivos');
       
       //verificando se existe
       let principal = false
       if(gruposSalvos) principal = true

       return principal
       
    } catch(error){
        throw new Error("Erro ao carregar grupos.");
    }
}

export function deletarCliente(nomeGrupo: string, macAddress: string){
    try{
        const gruposSalvos = MMKV.getString('gruposDispositivos');
        console.error(gruposSalvos)

        const grupos: GruposDispositivos = gruposSalvos ? JSON.parse(gruposSalvos) : {};
            
        if(gruposSalvos){   
            let dispositivosSalvos = grupos[nomeGrupo].dispositivos.filter(
                (d: Dispositivo) => d.mac !== macAddress)
        
            
            grupos[nomeGrupo] = {
                dispositivos: dispositivosSalvos,
                quantidade: dispositivosSalvos.length
            }
        
            MMKV.setString('gruposDispositivos', JSON.stringify(grupos))
            console.error(grupos)
        }     
    }catch(error){
        throw new Error("Erro ao deletar cliente.");
    }    
}
