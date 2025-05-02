/**GET /get_registro - Retorna registros de consultas para um domínio específico
                       (Recebe: domain-name, length)
*/

import { Registro } from "../utils/types";

export const getRegistro = async function (domain_name: string): Promise<Registro[]> {
    try{
        const response = await fetch(`/get_registro?domain_name=${domain_name}`, { 
            method: 'GET',
        });

        if(!response.ok) throw new Error("Erro ao tentar pegar os dados!!");

        return response.json();
    }catch(error){
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
        domain_name: domain,
        group_name: group
    }

    try{
        const response = await fetch('/add_domain_blocklist', { 
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dominioParaBloquear)
        });

        if(!response.ok) throw new Error("Erro ao tentar enviar os dados!!");

        return response.json();

    }catch(error){
        throw new Error("Erro ao tentar enviar os dados!!");
    }
    
}

export const createGroup = async function(group: string) {
    const novoGrupo = {
        group_name: group
    }

    try{
        const response = await fetch('/create_group', { 
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novoGrupo)
        });

        if(!response.ok) throw new Error("Erro ao tentar enviar o nome do grupo!!");

        return response.json();
    }catch(error){
        throw new Error("Erro ao tentar enviar o nome do grupo!!");
    }
    
}

export const addClient = async function(address: string, group: string) {

    const novoCliente = {
        client_address: address,
        group_name: group
    }

    try{
        const response = await fetch('/add_client', { 
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novoCliente)
        });

        if(!response.ok) throw new Error("Erro ao tentar enviar um cliente!!");

        return response.json();
    }catch(error){
        throw new Error("Erro ao tentar enviar um cliente!!");
    }
    
}

/** DELETE /delete_client - Remove um cliente
                            (Recebe: client_address)
*/

export const deleteClient = async function(client_address: string) {
    try{
        const response = await fetch(`/delete_client?client_address=${client_address}`, { 
            method: 'DELETE' 
        });

        if(!response.ok) throw new Error("Erro ao tentar excluir um cliente!!");

        return response.json();
    }catch(error){
        throw new Error("Erro ao tentar excluir um cliente!!");
    }
    
}