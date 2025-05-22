import React from "react";
import { addDomainBlocklist, createGroup, getRegistro } from "../requests_antigo";


describe('Testando request de queries do Pi Hole', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //Confirmar se eh assim mesmo que devolve
    it('Pegando registro de sites', async () => {
        const mockData = ['www.google.com.br', 'www.uol.com.br', 'www.terra.com.br', 'www.youtube.com.br']

        global.fetch = jest.fn().mockResolvedValue({
            status: 200,
            json: () => Promise.resolve(mockData)
        });

        const response = await getRegistro('FF:FF:FF:FF:FF:FF');
        expect(response).toEqual(mockData);
    });

    it('Lidando com erros', async () => {
        global.fetch = jest.fn().mockRejectedValue({
            status: 500,
            json: () => Promise.resolve([])
        });

        await expect(getRegistro('FF:FF:FF:FF:FF:FF'))
            .rejects
            .toThrow("Erro ao tentar pegar os dados!!");
    });

    it('Lidando com Network error', async() => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

        await expect(getRegistro('FF:FF:FF:FF:FF:FF'))
            .rejects
            .toThrow("Erro ao tentar pegar os dados!!");
    });
})

describe('Testando request de adicionar cliente, grupo e dominio no Pi Hole', () => {
    
    it('Adicionando um dominio para bloqueio', async () => {
        const domain_name = "www.uol.com.br";
        const group_name = "NovoGrupo"

        const mockData = {
            message: `Domínio ${domain_name} adicionado a lista de bloqueios do grupo ${group_name}`,
        };

        global.fetch = jest.fn().mockResolvedValue({
            status: 200,
            json: () => Promise.resolve(mockData)
        });

        const response = await addDomainBlocklist('www.uol.com.br', 'NovoGrupo');
        expect(response).toEqual(mockData);

    });

    it('Lidando com erros ao adicionar dominio', async () => {
        global.fetch = jest.fn().mockRejectedValue({
            status: 400,
            json: () => Promise.resolve([])
        });

        await expect(addDomainBlocklist('www.uol.com.br', 'NovoGrupo'))
            .rejects
            .toThrow("Erro ao tentar enviar os dados!!");
    });

    it('Adicionando um grupo', async () => {
        const mockData = "Grupo Filhos criado com sucesso";

        global.fetch = jest.fn().mockResolvedValue({
            status: 200,
            json: () => Promise.resolve(mockData)
        });

        const response = await createGroup('NovoGrupo');
        expect(response).toEqual(mockData);
    });

    it('Lidando com erros ao criar cliente', async () => {
         global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

        await expect(createGroup('NovoGrupo'))
            .rejects
            .toThrow("Erro ao tentar enviar o nome do grupo!!");
    });

    //addClient e erro
    //deleteClient e erro
    //deleteGroup e erro

});

