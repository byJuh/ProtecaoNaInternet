import { Dispatch, SetStateAction } from "react";
import { carregarDispositivos } from "../../../services/salvarDispostivos";
import { Dispositivo } from "../../../utils/types";
import { Alert } from "react-native";


export default function fetchDispositivos(grupoSelecionado: string, setDispositivos: Dispatch<SetStateAction<Dispositivo[]>>) {
    try{
        if(grupoSelecionado != null) {
            const dispositivosSalvos = carregarDispositivos(grupoSelecionado);
                    
            if(dispositivosSalvos) { 
              //if(dispositivosSalvos.length == 1) setMacAddress(dispositivosSalvos[0].mac)
              setDispositivos(dispositivosSalvos);
            }
        }
    } catch (error: unknown) {
        if (error instanceof Error) {  
            Alert.alert("Erro", error.message);
        }
    }
}
