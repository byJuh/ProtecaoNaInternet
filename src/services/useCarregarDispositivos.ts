import { Dispatch, SetStateAction } from "react";
import { Dispositivo } from "../utils/types";
import { Alert } from "react-native";
import { carregarDispositivos } from "./salvarDispostivos";

export default function getDispositivos(nomeGrupo: string, setDispositivos: Dispatch<SetStateAction<Dispositivo[]>>) {
    try {
        const dispositivosSalvos = carregarDispositivos(nomeGrupo);
                
        if(dispositivosSalvos != null) setDispositivos(dispositivosSalvos);
            
    } catch (error: unknown) {
        if (error instanceof Error) {
            Alert.alert("Erro", error.message);
        }
    }
}