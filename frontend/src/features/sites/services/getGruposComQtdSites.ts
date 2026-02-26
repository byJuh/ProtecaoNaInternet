import { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";
import { carregarGruposComQuantidadesDeSitesBloqueados } from "./salvarSitesBloqueados";

export default function getGruposComQuantidadesDeSitesBloqueados(setGrupos: Dispatch<SetStateAction<[string, number][]>>) {
    try {
        const sitesBloqueados = carregarGruposComQuantidadesDeSitesBloqueados();
                
        if(sitesBloqueados) setGrupos(Array.from(sitesBloqueados));
            
    } catch (error: unknown) {
        if (error instanceof Error) {
            Alert.alert("Erro", error.message);
        }
    }
}