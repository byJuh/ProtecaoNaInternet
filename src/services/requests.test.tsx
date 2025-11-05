import { Alert } from "react-native";
import { addClient, addDomainBlocklist, createGroup, deleteClient, deleteGroup, getRegistro } from "./requests";
import { v4 as uuidv4 } from "uuid";
import { getConnectionId, waitForResponse } from "../webSockets";

const mockSignal = {
    aborted: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    onabort: null,
} as unknown as AbortSignal

jest.mock("react-native", () => ({
  Alert: { alert: jest.fn() },
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid"),
}));

jest.mock("../webSockets", () => ({
  getConnectionId: jest.fn(),
  waitForResponse: jest.fn(),
}));

const mockedWaitForResponse = waitForResponse as jest.Mock;
const mockedGetConnectionId = getConnectionId as jest.Mock;

describe('Testando request de queries do Pi Hole', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockedGetConnectionId.mockReturnValue('mocked-connection-id');
        global.fetch = jest.fn()
        jest.spyOn(Alert, 'alert');
    });

    //Confirmar se eh assim mesmo que devolve
    it('Pegando registro de sites', async () => {
        const mockData = ['www.google.com.br', 'www.uol.com.br', 'www.terra.com.br', 'www.youtube.com.br'];

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({}),
            signal: mockSignal
        });

        mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: mockData,
            status: "ok"
        })

        const response = await getRegistro('FF:FF:FF:FF:FF:FF', mockSignal);
        
        expect(global.fetch).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('Requisição enviada, aguardando resposta...');

        expect(uuidv4).toHaveBeenCalled();
        expect(getConnectionId).toHaveBeenCalled();
        expect(waitForResponse).toHaveBeenCalledWith("mocked-uuid");


        expect(response).toEqual(mockData);
    });

    it('Lidando com erros', async () => {
        mockedWaitForResponse.mockClear();
        
        const erro = {
            error: "Nao foi possivel pegar os registros",
            status: "error"
        }

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(erro),
            signal: mockSignal
        });

        mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: "Não foram encontradas consultas para o domínio fornecido",
            status: "erro"
        });

        const response = await getRegistro('FF:FF:FF:FF:FF:FF',  mockSignal);
        expect(response).toEqual([]);

        expect(Alert.alert).toHaveBeenCalledWith("Requisição enviada, aguardando resposta...");
        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Não foram encontradas consultas para o domínio fornecido");

    });

    it('Lidando com erros, abortando fetch', async () => {
         global.fetch = jest.fn().mockRejectedValue(new DOMException('Requisição abortada', 'AbortError'));

        const response = await getRegistro('FF:FF:FF:FF:FF:FF',  mockSignal);
        expect(response).toEqual([]);
    });

    it('Lidando com erro, registro vazio', async () => {
    
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve([]),
            signal: mockSignal
        });

        mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: [],
            status: "ok"
        });

        const response = await getRegistro('FF:FF:FF:FF:FF:FF',  mockSignal);
        expect(response).toEqual([]);

        expect(Alert.alert).toHaveBeenCalledWith("Requisição enviada, aguardando resposta...");
        expect(Alert.alert).toHaveBeenCalledWith("Nenhum registro encontrado");
        
    });

    it('Lidando com erro no fetch, resposta.ok invalida', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
        });
        
        const response = await getRegistro('FF:FF:FF:FF:FF:FF', mockSignal);
        expect(response).toEqual([]);

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao tentar pegar os sites!!");
        
    });

    it('Lidando com erro no fetch, resposta.ok valida', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
        });
        
        const response = await getRegistro('FF:FF:FF:FF:FF:FF', mockSignal);
        expect(response).toEqual([]);

        expect(Alert.alert).toHaveBeenCalledWith('Requisição enviada, aguardando resposta...');
        
    });

    it('Lidando com Network error', async() => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network Request Failed'));

        await expect(getRegistro('FF:FF:FF:FF:FF:FF', mockSignal))
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
            json: () => Promise.resolve({})
        });

        mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: mockData,
            status: "ok"
        });

        const response = await addDomainBlocklist('www.uol.com.br', 'NovoGrupo');
        
        expect(global.fetch).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('Requisição enviada, aguardando resposta...');

        expect(uuidv4).toHaveBeenCalled();
        expect(getConnectionId).toHaveBeenCalled();
        expect(waitForResponse).toHaveBeenCalledWith("mocked-uuid");


        expect(response).toEqual(mockData);

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

        mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: "Não foi possível bloquear",
            status: "erro"
        });

        const response = await addDomainBlocklist('www.uol.com.br', 'NovoGrupo');
        expect(response).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith("Requisição enviada, aguardando resposta...");
        expect(Alert.alert).toHaveBeenCalledWith('Erro', mockData['Error']);
    
    });

    it('Lidando com erros ao adicionar dominio', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
        });

        const response = await addDomainBlocklist('www.uol.com.br', 'NovoGrupo')
        expect(response).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao tentar bloquear site!!");
    
    });

    it('Lidando com Network error ao adicionar dominio', async() => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network Request Failed'));

        await expect(addDomainBlocklist('www.uol.com.br', 'NovoGrupo'))
            .rejects
            .toThrow("Erro de rede: Network Request Failed");
    });

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

        mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: mockData,
            status: "ok"
        });

        const response = await createGroup('NovoGrupo');
        expect(global.fetch).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('Requisição enviada, aguardando resposta...');

        expect(uuidv4).toHaveBeenCalled();
        expect(getConnectionId).toHaveBeenCalled();
        expect(waitForResponse).toHaveBeenCalledWith("mocked-uuid");


        expect(response).toEqual(mockData);
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

        mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: "Não foi possivel criar o grupo NovoGrupo",
            status: "erro"
        });

        const response = await createGroup('NovoGrupo');
        expect(response).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith("Requisição enviada, aguardando resposta...");
        expect(Alert.alert).toHaveBeenCalledWith('Erro', mockData['Error']);
    });

    it('Lidando com grupo repetido', async () => {

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({})
        });

        mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: 'O grupo NovoGrupo já existe!',
            status: "existe"
        });

        const response = await createGroup('NovoGrupo');
        expect(response).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith("Requisição enviada, aguardando resposta...");
        expect(Alert.alert).toHaveBeenCalledWith('Existe', 'O grupo NovoGrupo já existe!');
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
            json: () => Promise.resolve({})
        });

        mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: mockData,
            status: "ok"
        });

        const response = await addClient('FF:FF:FF:FF:FF:FF', 'NovoGrupo');
        expect(global.fetch).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('Requisição enviada, aguardando resposta...');

        expect(uuidv4).toHaveBeenCalled();
        expect(getConnectionId).toHaveBeenCalled();
        expect(waitForResponse).toHaveBeenCalledWith("mocked-uuid");


        expect(response).toEqual(mockData);
    });

    it('Lidando com erro ao adicionar novo cliente', async () =>{
     
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({})
        });

         mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: 'Não foi possivel inserir o cliente FF:FF:FF:FF:FF:FF no grupo NovoGrupo',
            status: "erro"
        });

        const response = await addClient('FF:FF:FF:FF:FF:FF', 'NovoGrupo');
        expect(response).toEqual(undefined);

        expect(global.fetch).toHaveBeenCalled();

        expect(Alert.alert).toHaveBeenCalledWith("Requisição enviada, aguardando resposta...");
        expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Não foi possivel inserir o cliente FF:FF:FF:FF:FF:FF no grupo NovoGrupo');
    
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
            json: () => Promise.resolve({})
        });

        mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: 'Cliente FF:FF:FF:FF:FF:FF foi removido',
            status: "ok"
        });


        const response = await deleteClient('FF:FF:FF:FF:FF:FF', 'NovoGrupo');
        expect(response).toEqual(mockData['message']);

        expect(global.fetch).toHaveBeenCalled();

        expect(Alert.alert).toHaveBeenCalledWith("Requisição enviada, aguardando resposta...");
    });

    it('Lidando com erro ao deletar cliente', async () => {
    
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({})
        });

        mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: 'Não foi possivel remover o cliente FF:FF:FF:FF:FF:FF',
            status: "erro"
        });

        const response = await deleteClient('FF:FF:FF:FF:FF:FF', 'NovoGrupo');
        expect(response).toEqual(undefined)

        expect(global.fetch).toHaveBeenCalled();

        expect(Alert.alert).toHaveBeenCalledWith("Requisição enviada, aguardando resposta...");
        expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Não foi possivel remover o cliente FF:FF:FF:FF:FF:FF');
    
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

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({})
        });

        mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: 'Grupo NovoGrupo foi removido',
            status: "ok"
        });

        const response = await deleteGroup('NovoGrupo', ['FF:FF:FF:FF:FF:FF', 'AA:AA:AA:AA:AA:AA']);
        expect(response).toEqual("Grupo NovoGrupo foi removido");

        const response_macAddressVazio = await deleteGroup('NovoGrupo', []);
        expect(response_macAddressVazio).toEqual("Grupo NovoGrupo foi removido");
    });

    it('Lidando com erro ao deletar grupo', async () => {

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({})
        });

         mockedWaitForResponse.mockResolvedValue({
            correlationId: "mocked-uuid",
            message: 'Não foi possivel remover grupo NovoGrupo',
            status: "erro"
        });

        const response = await deleteGroup('NovoGrupo', ['FF:FF:FF:FF:FF:FF', 'AA:AA:AA:AA:AA:AA']);
        expect(response).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Não foi possivel remover grupo NovoGrupo');

        const response_macAddressVazio = await deleteGroup('NovoGrupo', []);
        expect(response_macAddressVazio).toEqual(undefined);

        expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Não foi possivel remover grupo NovoGrupo');
    
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

