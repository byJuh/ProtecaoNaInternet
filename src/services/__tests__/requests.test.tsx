import { Alert } from "react-native";
import { addClient, addDomainBlocklist, createGroup, deleteClient, deleteGroup, getRegistro } from "../requests";

/* Adicionar o que é novo e os erros que tem!! */

describe('Testando request de queries do Pi Hole', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert');
    });

    //Confirmar se eh assim mesmo que devolve
    it('Pegando registro de sites', async () => {
        const mockData = ['www.google.com.br', 'www.uol.com.br', 'www.terra.com.br', 'www.youtube.com.br']

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        const response = await getRegistro('FF:FF:FF:FF:FF:FF');
        expect(response).toEqual(mockData);
    });

    it('Lidando com erros', async () => {
        const erro = {
            error: "Nao foi possivel pegar os registros",
            status: "error"
        }

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(erro)
        });

        const response = await getRegistro('FF:FF:FF:FF:FF:FF');
        expect(response).toEqual([]);

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Nao foi possivel pegar os registros");

    })

    it('Lidando com erro, registro vazio', async () => {
    
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve([])
        });

        const response = await getRegistro('FF:FF:FF:FF:FF:FF');
        expect(response).toEqual([]);

        expect(Alert.alert).toHaveBeenCalledWith("Nenhum domínio encontrado");
        
    });

    it('Lidando com erro no fetch, resposta.ok invalida', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
        });
        
        const response = await getRegistro('FF:FF:FF:FF:FF:FF');
        expect(response).toEqual([]);

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao tentar pegar os sites!!");
        
    });

    it('Lidando com Network error', async() => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network Request Failed'));

        await expect(getRegistro('FF:FF:FF:FF:FF:FF'))
            .rejects
            .toThrow("Erro de rede: Network Request Failed");
    });
})

describe('Testando request de adicionar dominio no Pi Hole', () => {
    
    it('Adicionando um dominio para bloqueio', async () => {
        const domain_name = "www.uol.com.br";
        const group_name = "NovoGrupo"

        const mockData = {
            message: `Domínio ${domain_name} adicionado a lista de bloqueios do grupo ${group_name}`,
            status: 'ok'
        };

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        const response = await addDomainBlocklist('www.uol.com.br', 'NovoGrupo');
        expect(response).toEqual(mockData['message']);

    });

    it('Lidando com status error', async () => {

        const mockData = {
            Error: "Não foi possível bloquear", 
            status: "erro"
        };

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        const response = await addDomainBlocklist('www.uol.com.br', 'NovoGrupo');
        expect(response).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith('Erro', mockData['Error']);
    
    });

    it('Lidando com erros ao adicionar dominio', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
        });

        const response = await addDomainBlocklist('www.uol.com.br', 'NovoGrupo')
        expect(response).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith("Erro ao tentar bloquear site!!");
    
    });

    it('Lidando com Network error ao adicionar dominio', async() => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network Request Failed'));

        await expect(addDomainBlocklist('www.uol.com.br', 'NovoGrupo'))
            .rejects
            .toThrow("Erro de rede: Network Request Failed");
    });

   
    //addClient e erro
    //deleteClient e erro
    //deleteGroup e erro

});

describe('Testando request de criar Grupo', () => {

    it('Adicionando um grupo', async () => {
        const mockData = {
            message: "Grupo NovoGrupo criado com sucesso",
            status: "ok"
        };

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        const response = await createGroup('NovoGrupo');
        expect(response).toEqual(mockData['message']);
    });

    it('Lidando com erros ao criar grupo', async () => {
         const mockData = {
            Error: 'Não foi possivel criar o grupo NovoGrupo', 
            status: "erro"
        };

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        const response = await createGroup('NovoGrupo');
        expect(response).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith('Erro', mockData['Error']);
    
    });

    it('Lidando com grupo repetido', async () => {
         const mockData = {
            Exist: 'O grupo NovoGrupo já existe!', 
            status: "existe"
        };

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        await createGroup('NovoGrupo');
        expect(Alert.alert).toHaveBeenCalledWith('Erro', mockData['Exist']);
    
    });

    it('Lidando com response.ok invalido ao criar grupo', async () => {

        global.fetch = jest.fn().mockResolvedValue({
            ok: false
        });

        const response = await createGroup('NovoGrupo');
        expect(response).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao criar grupo!!");
    
    });

    it('Lidando com Network error ao criar grupo', async() => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network Request Failed'));

        await expect(createGroup('NovoGrupo'))
            .rejects
            .toThrow("Erro de rede: Network Request Failed");
    });
});

describe('Testando request de adicionar cliente', () =>{
    it('Adicionando novo cliente', async () => {
        const mockData = {
            message: 'Cliente FF:FF:FF:FF:FF:FF foi inserido no grupo NovoGrupo com sucesso', 
            status: "ok"
        }

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        const response = await addClient('FF:FF:FF:FF:FF:FF', 'NovoGrupo');
        expect(response).toEqual(mockData['message']);
    });

    it('Lidando com erro ao adicionar novo cliente', async () =>{
        const mockData = {
            Error: 'Não foi possivel inserir o cliente FF:FF:FF:FF:FF:FF no grupo NovoGrupo', 
            status: "erro"
        }

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        const response = await addClient('FF:FF:FF:FF:FF:FF', 'NovoGrupo');
        expect(response).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith('Erro', mockData['Error']);
    
    });

    it('Lidando com resposta.ok invalido ao adicionar cliente', async () =>{
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
        });

        const response = await addClient('FF:FF:FF:FF:FF:FF', 'NovoGrupo');
        expect(response).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith('Erro',"Erro ao criar grupo!!");
    
    });

    it('Lidando com Network error ao adicionar cliente', async() => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network Request Failed'));

        await expect(addClient('FF:FF:FF:FF:FF:FF', 'NovoGrupo'))
            .rejects
            .toThrow("Erro de rede: Network Request Failed");
    });
});

describe('Testando request de deletar cliente', () => {
    it('Deletando cliente', async () => {
        const mockData = {
            message: 'Cliente FF:FF:FF:FF:FF:FF foi removido', 
            status: "ok"
        }

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        const response = await deleteClient('FF:FF:FF:FF:FF:FF', 'NovoGrupo');
        expect(response).toEqual(mockData['message']);
    });

    it('Lidando com erro ao deletar cliente', async () => {
        const mockData = {
            Error: 'Não foi possivel remover o cliente FF:FF:FF:FF:FF:FF', 
            status: "erro"
        }

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        const response = await deleteClient('FF:FF:FF:FF:FF:FF', 'NovoGrupo');
        expect(response).toEqual(undefined)

        expect(Alert.alert).toHaveBeenCalledWith('Erro', mockData['Error']);
    
    });

    it('Lidando response.ok invalido ao deletar cliente', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
        });

        const response = await deleteClient('FF:FF:FF:FF:FF:FF', 'NovoGrupo');
        expect(response).toEqual(undefined)

        expect(Alert.alert).toHaveBeenCalledWith("Erro" ,"Erro ao criar grupo!!");
    
    });

    it('Lidando com Network error ao adicionar cliente', async() => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network Request Failed'));

        await expect(deleteClient('FF:FF:FF:FF:FF:FF', 'NovoGrupo'))
            .rejects
            .toThrow("Erro de rede: Network Request Failed");
    });
});

describe('Testando request de deletar grupo', () => {

    it('Deletando grupo', async () => {
        const mockData = {
            message: 'Grupo NovoGrupo foi removido', 
            status: "ok"
        }

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        const response = await deleteGroup('NovoGrupo', ['FF:FF:FF:FF:FF:FF', 'AA:AA:AA:AA:AA:AA']);
        expect(response).toEqual(mockData['message']);

        const response_macAddressVazio = await deleteGroup('NovoGrupo', []);
        expect(response_macAddressVazio).toEqual(mockData['message']);
    });

    it('Lidando com erro ao deletar grupo', async () => {
        const mockData = {
            Error: 'Não foi possivel remover grupo NovoGrupo', 
            status: "erro"
        }

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        const response = await deleteGroup('NovoGrupo', ['FF:FF:FF:FF:FF:FF', 'AA:AA:AA:AA:AA:AA']);
        expect(response).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith('Erro', mockData['Error']);

        const response_macAddressVazio = await deleteGroup('NovoGrupo', []);
        expect(response_macAddressVazio).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith('Erro', mockData['Error']);
    
    });

    it('Lidando response.ok invalido ao deletar grupo', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
        });

        const response = await deleteGroup('NovoGrupo', ['FF:FF:FF:FF:FF:FF', 'AA:AA:AA:AA:AA:AA']);
        expect(response).toEqual(undefined)

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao deletar grupo!!");
    
        const response_macAddressVazio = await deleteGroup('NovoGrupo', []);
        expect(response_macAddressVazio).toEqual(undefined)

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao deletar grupo!!");
    
    });

    it('Lidando com Network error ao adicionar grupo com cliente', async() => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network Request Failed'));

        await expect(deleteGroup('NovoGrupo', ['FF:FF:FF:FF:FF:FF', 'AA:AA:AA:AA:AA:AA']))
            .rejects
            .toThrow("Erro de rede: Network Request Failed");
    });

    it('Lidando com Network error ao adicionar grupo sem cliente', async() => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network Request Failed'));

        await expect(deleteGroup('NovoGrupo', []))
            .rejects
            .toThrow("Erro de rede: Network Request Failed");
    });
})

