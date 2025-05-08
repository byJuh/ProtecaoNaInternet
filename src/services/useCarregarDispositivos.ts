import { Dispatch, SetStateAction } from "react";
import { carregarDispositivos } from "./salvarDispositivos";
import { Dispositivo } from "../utils/types";
import { Alert } from "react-native";


export default async function fetchDispositivos(grupoSelecionado: string, setMacAddress: Dispatch<SetStateAction<string>>, setDispositivos: Dispatch<SetStateAction<Dispositivo[]>>) {
    try{
        if(grupoSelecionado != null) {
            const dispositivosSalvos = await carregarDispositivos(grupoSelecionado);
                    
            if(dispositivosSalvos != null) { 
              if(dispositivosSalvos.length == 1) setMacAddress(dispositivosSalvos[0].mac)
              setDispositivos(dispositivosSalvos);
            }
        }
    } catch (error: unknown) {
        if (error instanceof Error) {  
            Alert.alert("Erro", error.message);
        }
    }
}