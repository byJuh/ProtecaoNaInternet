import { Dispatch, SetStateAction } from "react";
import { Registro } from "../utils/types";
import { getRegistro } from "./requests";
import { Alert } from "react-native";

export default async function pegandoRegistros(setRegistros: Dispatch<SetStateAction<Registro[]>>, macAddress: string, signal: AbortSignal) {
   try{
      const response = await getRegistro(macAddress, signal);

      if(response.length != 0) setRegistros(response)
            
   }catch (error: unknown) {

      if (error instanceof DOMException && error.name === 'AbortError') {
            return;
      }
      
      if (error instanceof Error) {
         Alert.alert("Erro", error.message);
      } else {
         Alert.alert("Erro desconhecido", "Ocorreu um erro inesperado.");
      }
   }
}