import { Dispatch, SetStateAction } from "react";
import { Dispositivo } from "../utils/types";
import { Alert } from "react-native";
import { carregarDispositivos } from "./salvarDispositivos";

export default async function getDispositivos(nomeGrupo: string, setDispositivos: Dispatch<SetStateAction<Dispositivo[]>>) {
    try {
        const dispositivosSalvos = await carregarDispositivos(nomeGrupo);
                
        if(dispositivosSalvos != null) setDispositivos(dispositivosSalvos);
            
    } catch (error: unknown) {
        if (error instanceof Error) {
            Alert.alert("Erro", error.message);
        }
    }
}