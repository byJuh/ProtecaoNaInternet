import { Dispatch, SetStateAction } from "react";
import { Registro } from "../utils/types";
import { getRegistro } from "./requests";
import { Alert } from "react-native";

export default async function pegandoRegistros(setRegistros: Dispatch<SetStateAction<Registro[]>>, macAddress: string) {
      try{
        const response = await getRegistro(macAddress);

        if(response) setRegistros(response)

      }catch (error: unknown) {
         if (error instanceof Error) {
            Alert.alert("Erro", error.message);
         } 
      }
    }