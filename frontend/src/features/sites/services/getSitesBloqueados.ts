import { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";
import { carregarSitesBloqueadosDoGrupo } from "./salvarSitesBloqueados";

export default function getSitesBloqueados(nomeGrupo: string, setSites: Dispatch<SetStateAction<string[]>>) {
    try {
        const sitesBloqueados = carregarSitesBloqueadosDoGrupo(nomeGrupo);
                
        if(sitesBloqueados) setSites(sitesBloqueados);
            
    } catch (error: unknown) {
        if (error instanceof Error) {
            Alert.alert("Erro", error.message);
        }
    }
}