import { Registro } from "../utils/types";

/**GET /get_registro - Retorna registros de consultas para um domínio específico
                       (Recebe: domain-name, length)
*/

export const getRegistro = async function (domain_name: string): Promise<Registro[]> {

    const dominioParaRegistro = {
        "domain-name": domain_name,
        "length": '30'
    }

    try{
       const response = await fetch(`http://192.168.0.21:8000/get_registro`, { 
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dominioParaRegistro)
        });

       if(response.status !== 200) throw new Error("Erro ao tentar enviar um cliente!!");
        
        return response.json();
    }catch(error){
        //console.error("catch query!!")
        //console.error(error)
        throw new Error("Erro ao tentar pegar os dados!!");
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

    try{
        const response = await fetch('http://192.168.0.21:8000/add_domain_blocklist', { 
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dominioParaBloquear)
        });

        //alem de verificar status
        if(response.status !== 200) throw new Error("Erro ao tentar enviar os dados!!");
        
        return response.json();

    }catch(error){
        throw new Error("Erro ao tentar enviar os dados!!");
    }
    
}

export const createGroup = async function(group: string) {
    const novoGrupo = {
        'group-name': group
    }

    try{
        const response = await fetch('http://192.168.0.21:8000/create_group', { 
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novoGrupo)
        });

        if(response.status !== 200) throw new Error("Erro ao tentar enviar o nome do grupo!!");

        return response.json();
    }catch(error){
        throw new Error("Erro ao tentar enviar o nome do grupo!!");
    }
    
}

export const addClient = async function(address: string, group: string) {

    const novoCliente = {
        'client_address': address,
        'group_name': group
    }

    try{
        const response = await fetch('http://192.168.0.21:8000/add_client', { 
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novoCliente)
        });

        if(!response.ok) {
            throw new Error("Erro ao tentar enviar um cliente!!");
        }else{
            return true
        }

    }catch(error){
        console.error(error)
        throw new Error("Erro ao tentar enviar um cliente!!");
    }
    
}

/** DELETE /delete_client - Remove um cliente
                            (Recebe: client_address)
*/

export const deleteClient = async function(client_address: string, group_name: string) {

    const deletaCliente = {
        "client_address": client_address,
        "group_name": group_name
    }

    try{
        const response = await fetch(`http://192.168.0.21:8000/delete_client`, { 
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(deletaCliente)
        });

        if(response.status !== 200) throw new Error("Erro ao tentar excluir um cliente!!");

        return response.json();
    }catch(error){
        throw new Error("Erro ao tentar excluir um cliente!!");
    }
    
}

export const deleteGroup = async function(grupo: string, macAddress: string[]) {

    const deletaGrupo = {
        "group_name": grupo,
        "mac_address": macAddress
    }

    try{
        const response = await fetch(`http://192.168.0.21:8000/delete_group`, { 
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(deletaGrupo)
        });

        if(response.status !== 200) throw new Error("Erro ao tentar excluir um grupo!!");

        return response.json();
    }catch(error){
        throw new Error("Erro ao tentar excluir um grupo!!");
    }
    
}