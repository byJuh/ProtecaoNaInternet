import { Dispatch, SetStateAction } from "react";
import { carregarGrupos } from "../../../services/salvarDispostivos";
import { Alert } from "react-native";

export default function fetchGrupos(setGrupos: Dispatch<SetStateAction<Map<string,number>>>) {
      try {
        const gruposSalvos = carregarGrupos();

        if(gruposSalvos) {
            setGrupos(gruposSalvos)
            // if(gruposSalvos.size == 1) {
            //     const grupo = gruposSalvos.keys().next().value
            //     if(grupo) setGruposSelecionados(grupo)
            // }
        }
        
        } catch (error: unknown) {
          if (error instanceof Error) {  
              Alert.alert("Erro", error.message);
            }
         }
    }
    