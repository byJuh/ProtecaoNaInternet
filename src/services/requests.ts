import { Alert } from "react-native";
import {Registro} from "../utils/types";
import { v4 as uuidv4 } from 'uuid';
import {  getConnectionId, waitForResponse } from "../webSockets";

/**GET /get_registro - Retorna registros de consultas para um domínio específico
                       (Recebe: domain-name, length)
*/
let primeiraVez = true;

export const getRegistro = async function (macAddress: string, signal: AbortSignal): Promise<Registro[]>{
    const correlationId = uuidv4();
    const connectionId = getConnectionId();

    if(!connectionId && !primeiraVez){
        Alert.alert('Erro', 'WebSocket não conectado. Tente novamente mais tarde.');
        primeiraVez = false;
        return [];
    }

    const dominioParaRegistro = {
        "domain-name": macAddress,
        'correlationId': correlationId,
        'connectionId': connectionId
    }

    const responsePromise = waitForResponse(correlationId);

    try{
        const response = await fetch("https://1xu6ytlkc8.execute-api.us-east-2.amazonaws.com/getQueries", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dominioParaRegistro),
            signal: signal
        });

        if(response){
            Alert.alert('Requisição enviada, aguardando resposta...');
        }

        if(!response.ok){
            Alert.alert("Erro", "Erro ao criar grupo!!");
            return [];
        }

        const data = await responsePromise;

        if(data){

            if(data['status'] === 'ok'){
                if(Array.isArray(data['message'])) {
                    if(data['message'].length > 0){
                        return data['message']
                    }else{
                        Alert.alert("Nenhum registro encontrado")
                        return []
                    }
                } 
            } else {
                Alert.alert('Erro', data['message']);
            }
        } else {
            Alert.alert("Erro", "Erro ao tentar pegar os sites!!");
            return []
        }
      return [];
    }catch(error: unknown){
        if (error instanceof DOMException && error.name === 'AbortError') {
            return [];
        }else{
            throw new Error("Erro de rede: Network Request Failed");
        } 
    }
}

/**POST /add_domain_blocklist - Adiciona um domínio à lista de bloqueios de um grupo
                                (Recebe: domain-name, group-name)

POST /add_client - Adiciona um cliente a um grupo existente
                   (Recebe: client_address, group_name)

POST /create_group - Cria um novo grupo no Pi-hole
                     (Recebe: group-name)

POST /add_client - Adiciona um cliente a um grupo existente
                   (Recebe: client_address, group_name)
*/

export const addDomainBlocklist = async function(domain: string, group: string) {
    const correlationId = uuidv4();
    const connectionId = getConnectionId();

    if(!connectionId){
        Alert.alert('Erro', 'WebSocket não conectado. Tente novamente mais tarde.');
        return;
    }

    const responsePromise = waitForResponse(correlationId);

    const dominioParaBloquear = {
        "domain-name": domain,
        "group-name": group,
        'correlationId': correlationId,
        'connectionId': connectionId
    }

    try {
        const response = await fetch("https://8h6jj9qq32.execute-api.us-east-2.amazonaws.com/adicionarBloqueio", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dominioParaBloquear)
        });
    
        if(response){
            Alert.alert('Requisição enviada, aguardando resposta...');
        }

        if(!response.ok){
            Alert.alert("Erro", "Erro ao criar grupo!!");
            return;
        }

        const data = await responsePromise;

        if(data){

            if(data['status'] === 'ok'){
                return data['message']
            } else {
                Alert.alert('Erro', data['message']);
            } 

        } else {
            Alert.alert('Erro', 'Nenhuma resposta do servidor. Tente novamente.');
        }
    } catch (error) {
        throw new Error("Erro de rede: Network Request Failed");
    }
}

export const unblockDomain = async function(domain: string, group: string) {
    const correlationId = uuidv4();
    const connectionId = getConnectionId();

    if(!connectionId){
        Alert.alert('Erro', 'WebSocket não conectado. Tente novamente mais tarde.');
        return;
    }

    const responsePromise = waitForResponse(correlationId);

    const dominioParaDesbloquear = {
        "domain-name": domain,
        "group-name": group,
        'correlationId': correlationId,
        'connectionId': connectionId
    }

    try {

        const response = await fetch("https://b6hyiw7na6.execute-api.us-east-2.amazonaws.com/removerBloqueio", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dominioParaDesbloquear)
        });

        if(response){
            Alert.alert('Requisição enviada, aguardando resposta...');
        }

        if(!response.ok){
            Alert.alert("Erro", "Erro ao desbloquear site!!");
            return;
        }

        const data = await responsePromise;

        if(data){

            if(data['status'] === 'ok'){
                return data['message']
            }
            else {
                Alert.alert('Erro', data['message']);
            }
        } else {
            Alert.alert('Erro', 'Nenhuma resposta do servidor. Tente novamente.');
        }
    } catch (error) {
        throw new Error("Erro de rede: Network Request Failed");
    }
}

export const createGroup = async function(group: string) {
    const correlationId = uuidv4();
    const connectionId = getConnectionId();

    if(!connectionId){
        Alert.alert('Erro', 'WebSocket não conectado. Tente novamente mais tarde.');
        return;
    }

    const responsePromise = waitForResponse(correlationId);

    const novoGrupo = {
        'group-name': group,
        'correlationId': correlationId,
        'connectionId': connectionId
    }

    try {
        const response = await fetch("https://dm9ou0bjk6.execute-api.us-east-2.amazonaws.com/criarGrupo/", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novoGrupo)
        });

        console.log(response)

        if(response){
            Alert.alert('Requisição enviada, aguardando resposta...');
        }

        if(!response.ok){
            Alert.alert("Erro", "Erro ao criar grupo!!");
            return;
        }

        const data = await responsePromise;

        if(data){

            if(data['status'] === 'ok'){
                return data['message']
            } else if(data['status'] === 'erro'){
                Alert.alert('Erro', data['message']);
            } else {
                Alert.alert('Existe', data['message']);
            }

        } else {
            Alert.alert('Erro', 'Nenhuma resposta do servidor. Tente novamente.');
        }

    } catch(error) {
        throw new Error("Erro de rede: Network Request Failed");
    }
}

export const addClient = async function(address: string, group: string) {
    const correlationId = uuidv4();
    const connectionId = getConnectionId();

    if(!connectionId){
        Alert.alert('Erro', 'WebSocket não conectado. Tente novamente mais tarde.');
        return;
    }
    
    const responsePromise = waitForResponse(correlationId);
    
    const novoCliente = {
        'client_address': address,
        'group_name': group,
        'correlationId': correlationId,
        'connectionId': connectionId
    }

    try{
        const response = await fetch("https://wc3wu8hwlg.execute-api.us-east-2.amazonaws.com/addCliente/", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novoCliente)
        });

    
        if(response){
            Alert.alert('Requisição enviada, aguardando resposta...');
        }

        if(!response.ok){
            Alert.alert("Erro", "Erro ao adicionar cliente!!");
            return;
        }

        const data = await responsePromise;

        if(data){

            if(data['status'] === 'ok'){
                return data['message']
            } else {
                Alert.alert('Erro', data['message']);
            } 

        } else {
            Alert.alert('Erro', 'Nenhuma resposta do servidor. Tente novamente.');
        }

    }catch(error){
        //console.error(JSON.stringify(error));
        throw new Error("Erro de rede: Network Request Failed");
    }
}

/** DELETE /delete_client - Remove um cliente
                            (Recebe: client_address)
    
    DELETE /delete_group - Remove um grupo
                           (Recebe: client_address, group_name)
*/

export const deleteClient = async function(client_address: string, group_name: string) {
    const correlationId = uuidv4();
    const connectionId = getConnectionId();

    if(!connectionId){
        Alert.alert('Erro', 'WebSocket não conectado. Tente novamente mais tarde.');
        return;
    }

    const responsePromise = waitForResponse(correlationId);

    const deletaCliente = {
        "client_address": client_address,
        "group_name": group_name,
        'correlationId': correlationId,
        'connectionId': connectionId
    }

    try{
        const response = await fetch("https://3ci7g5p28j.execute-api.us-east-2.amazonaws.com/deletarCliente", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(deletaCliente)
        });

        if(response){
            Alert.alert('Requisição enviada, aguardando resposta...');
        }

        if(!response.ok){
            Alert.alert("Erro", "Erro ao adicionar cliente!!");
            return;
        }


        const data = await responsePromise;

        if(data){

            if(data['status'] === 'ok'){
                return data['message']
            } else {
                Alert.alert('Erro', data['message']);
            } 

        } else {
            Alert.alert('Erro', 'Nenhuma resposta do servidor. Tente novamente.');
        }

    } catch(error){
        throw new Error("Erro de rede: Network Request Failed");
    }
}

export const deleteGroup = async function(grupo: string, macAddress: string[]) {
    const correlationId = uuidv4();
    const connectionId = getConnectionId();

    if(!connectionId){
        Alert.alert('Erro', 'WebSocket não conectado. Tente novamente mais tarde.');
        return;
    }

    const responsePromise = waitForResponse(correlationId);

    const deletaGrupo = {
        "group_name": grupo,
        "macAddress": macAddress,
        'correlationId': correlationId,
        'connectionId': connectionId
    }

    try{
        const response = await fetch("https://kob15ojcu3.execute-api.us-east-2.amazonaws.com/deletarGrupo", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(deletaGrupo)
        });

        if(response){
            Alert.alert('Requisição enviada, aguardando resposta...');
        }

        if(!response.ok){
            Alert.alert("Erro", "Erro ao adicionar cliente!!");
            return;
        }


        const data = await responsePromise;

        if(data){

            if(data['status'] === 'ok'){
                return data['message']
            } else {
                Alert.alert('Erro', data['message']);
            } 

        } else {
            Alert.alert('Erro', 'Nenhuma resposta do servidor. Tente novamente.');
        }

    } catch(error) {
        throw new Error("Erro de rede: Network Request Failed");
    }
}