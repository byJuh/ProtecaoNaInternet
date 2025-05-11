import { Alert } from "react-native";
import { carregarGrupos } from "./salvarDispositivos";
import { Dispatch, SetStateAction } from "react";

export default async function getGruposQtdDispositivos(setGrupos: Dispatch<SetStateAction<[string, number][]>>){
    try {
        const gruposSalvos = await carregarGrupos();
                
        //transformando em array [nomeGrupo: string, quantidade: number]
        if(gruposSalvos != null) setGrupos(Array.from(gruposSalvos));
            
    } catch (error: unknown) {
        if (error instanceof Error) {
            Alert.alert("Erro", error.message);
        }
    }
}
