import { Dispatch, SetStateAction } from "react";
import { carregarGrupos } from "./salvarDispositivos";
import { Alert } from "react-native";

export default async function fetchGrupos(setGrupos: Dispatch<Map<string,number>>, setGruposSelecionados: Dispatch<SetStateAction<string>>) {
      try {
        const gruposSalvos = await carregarGrupos();

        if(gruposSalvos != null) {
            setGrupos(gruposSalvos)
            if(gruposSalvos.size == 1) {
                const grupo = gruposSalvos.keys().next().value
                if(grupo != undefined) setGruposSelecionados(grupo)
            }
        }
        
        } catch (error: unknown) {
          if (error instanceof Error) {  
            Alert.alert("Erro", error.message);
            }
         }
    }