import { Alert } from "react-native";
import {Registro} from "../utils/types";

/**GET /get_registro - Retorna registros de consultas para um domínio específico
                       (Recebe: domain-name, length)
*/

export const getRegistro = async function (macAddress: string): Promise<Registro[]> {
    const dominioParaRegistro = {
        "domain-name": macAddress,
        "length": '30'
    }

    try{
        const response = await fetch("http://192.168.0.21:8000/get_registro", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dominioParaRegistro)
        });

        if(response.ok){
            const resposta = await response.json()

            if(Array.isArray(resposta)) {
                if(resposta.length > 0){
                    //devolveu os dominios
                    console.error(resposta)
                    return resposta
                }else{
                    Alert.alert("Nenhum domínio encontrado")
                    return []
                }
            } else {
                Alert.alert("Erro", "Verifique o DNS no celular ou a internet")
                return []
            }
        } else {
            throw new Error("Erro ao tentar pegar os sites!!");
        }
    }catch(error){
        throw new Error("Erro de rede: " + error);
    }
}

/**POST /add_domain_blocklist - Adiciona um domínio à lista de bloqueios de um grupo
                                (Recebe: domain-name, group-name)

POST /create_group - Cria um novo grupo no Pi-hole
                     (Recebe: group-name)

POST /add_client - Adiciona um cliente a um grupo existente
                   (Recebe: client_address, group_name)
*/

export const addDomainBlocklist = async function(domain: string, group: string) {
    const dominioParaBloquear = {
        "domain-name": domain,
        "group-name": group
    }

    try {
        const response = await fetch("http://192.168.0.21:8000/add_domain_blocklist", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dominioParaBloquear)
        });
    
        if(response.ok){
            const resposta = await response.json()

            if(resposta){
                if(resposta['status'] === 'ok'){
                    return resposta['message']
                } else {
                    Alert.alert('Erro', resposta['Error'])
                }
            } else {
                throw new Error("Erro ao tentar bloquear site!!");
            }
        } else {
            throw new Error("Erro ao tentar bloquear site!!");
        }
    } catch (error) {
        throw new Error("Erro de rede: " + error);
    }
}

export const createGroup = async function(group: string) {
    const novoGrupo = {
        'group-name': group
    }

    try {
        const response = await fetch("http://192.168.0.21:8000/create_group", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novoGrupo)
        });

        if(response.ok){
            const resposta = await response.json()

            if(resposta){
                if(resposta['status'] === 'ok'){
                    return resposta['message']
                }else if(resposta['status'] === 'erro'){
                    Alert.alert('Erro', resposta['Error'])
                }else {
                    Alert.alert('Erro', resposta['Exist'])
                }
            } else {
                throw new Error("Erro ao criar grupo!!");
            }
        } else {
            throw new Error("Erro ao criar grupo!!");
        }
    } catch(error) {
        throw new Error("Erro de rede: " + error);
    }
}

export const addClient = async function(address: string, group: string) {
    const novoCliente = {
        'client_address': address,
        'group_name': group
    }

    try{
        const response = await fetch("http://192.168.0.21:8000/add_client", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novoCliente)
        });

        if(response.ok){
            const resposta = await response.json()

            if(resposta){
                if(resposta['status'] === 'ok'){
                    return resposta['message']
                }else{
                    Alert.alert('Erro', resposta['Error'])
                }
            } else {
                throw new Error("Erro ao criar grupo!!");
            }
        } else {
            throw new Error("Erro ao criar grupo!!");
        }
    }catch(error){
        console.error(JSON.stringify(error));
        throw new Error("Erro de rede: " + error);
    }
}

/** DELETE /delete_client - Remove um cliente
                            (Recebe: client_address)
    
    DELETE /delete_group - Remove um grupo
                           (Recebe: client_address, group_name)
*/

export const deleteClient = async function(client_address: string, group_name: string) {
    const deletaCliente = {
        "client_address": client_address,
        "group_name": group_name
    }

    try{
        const response = await fetch("http://192.168.0.21:8000/delete_client", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(deletaCliente)
        });

        if(response.ok){
            const resposta = await response.json()

            if(resposta){
                if(resposta['status'] === 'ok'){
                    return resposta['message']
                } else {
                    Alert.alert('Erro', resposta['Error'])
                }
            } else {
                throw new Error("Erro ao criar grupo!!");
            }
        } else {
            throw new Error("Erro ao criar grupo!!");
        }
    } catch(error){
        throw new Error("Erro de rede: " + error);
    }
}

export const deleteGroup = async function(grupo: string, macAddress: string[]) {
    const deletaGrupo = {
        "group_name": grupo,
        "macAddress": macAddress
    }

    try{
        const response = await fetch("http://192.168.0.21:8000/delete_group", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(deletaGrupo)
        });

        if(response.ok){
            const resposta = await response.json()

            if(resposta) {
                if(resposta['status'] === 'ok'){
                    return resposta['message']
                }else{
                    Alert.alert('Erro', resposta['Error'])
                    console.error('erro')
                }
            } else {
                throw new Error("Erro ao deletar grupo!!");
            }
        } else {
            throw new Error("Erro ao deletar grupo!!");
        }
    } catch(error) {
        throw new Error("Erro de rede: " + error);
    }
}