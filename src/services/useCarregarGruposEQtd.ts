import { Alert } from "react-native";
import { carregarGrupos } from "./salvarDispostivos";
import { Dispatch, SetStateAction } from "react";

export default function getGruposQtdDispositivos(setGrupos: Dispatch<SetStateAction<[string, number][]>>){
    try {
        const gruposSalvos = carregarGrupos();
                
        if(gruposSalvos) setGrupos(Array.from(gruposSalvos));
            
    } catch (error: unknown) {
        if (error instanceof Error) {
            Alert.alert("Erro", error.message);
        }
    }
}
