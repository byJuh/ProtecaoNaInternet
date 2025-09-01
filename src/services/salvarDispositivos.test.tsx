import { salvarDispositivos, carregarDispositivos, carregarGrupos, deletarDispositivo, deletarGrupo, verificarQuantidadeGrupos, deletarCliente } from "./salvarDispostivos";
import { MMKV } from "../utils/inicializarMMKV";
import { Alert } from "react-native";

jest.mock('../../utils/inicializarMMKV', () => ({
    MMKV: {
        getString: jest.fn(),
        setString: jest.fn(),
    }
    
}));

describe('Testes de armazenamento de dispositivos', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert');
    });

    it('Salvando um dispositivo em um novo grupo', () => {
        (MMKV.getString as jest.Mock).mockReturnValue(null);

        //Simulando a chamada da funcao, adicionando um dispositivo
        salvarDispositivos('NovoDispositivo', 'FF:FF:FF:FF:FF:FF', 'NovoGrupo');
        
        //espera que o item seja salvo
        expect(MMKV.setString).toHaveBeenCalled();
        
        const dadosSalvos = JSON.parse((MMKV.setString as jest.Mock).mock.calls[0][1]);
        
        expect(dadosSalvos['NovoGrupo']).toEqual({
            quantidade: 1,
            dispositivos: [
                {nome: 'NovoDispositivo', mac: 'FF:FF:FF:FF:FF:FF'}
            ]
        });
    });

    it('Salvando um dispositivo em um grupo existente', () => {
        const grupoSalvo = {
            Grupo: {
                quantidade: 1,
                dispositivos: [
                    {nome: 'NovoDispositivo', mac: 'FF:FF:FF:FF:FF:FF'}
                ]
            }
        };

        //simulando que ja tem grupo salvo
        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(grupoSalvo))
        
        salvarDispositivos('SegundoNovoDispositivo', 'AA:AA:AA:AA:AA:AA', 'Grupo');

        expect(MMKV.setString).toHaveBeenCalled();

        const dadosSalvos = JSON.parse((MMKV.setString as jest.Mock).mock.calls[0][1]);

        expect(dadosSalvos['Grupo'].quantidade).toBe(2);
        expect(dadosSalvos['Grupo']).toEqual({
            quantidade: 2,
            dispositivos: [
                {nome: 'NovoDispositivo', mac: 'FF:FF:FF:FF:FF:FF'},
                {nome: 'SegundoNovoDispositivo', mac: 'AA:AA:AA:AA:AA:AA'}
            ]
        })
    });

    //fazer de um caso ja exista o dispositivo no grupo 
    it('Salvando um dispositivo sendo que ele já está salvo', () => {
        const grupoSalvo = {
            Grupo: {
                quantidade: 1,
                dispositivos: [
                    {nome: 'NovoDispositivo', mac: 'FF:FF:FF:FF:FF:FF'}
                ]
            }
        };

        //simulando que ja tem grupo salvo
        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(grupoSalvo))
        
        const responde = salvarDispositivos('SegundoNovoDispositivo', 'FF:FF:FF:FF:FF:FF', 'Grupo');
        expect(responde).toEqual(undefined)

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Esse dispositivo ja esta salvo no grupo!!");
        
    });

    it('Deletando dispositivos', () => {
        const grupoSalvo = {
            Grupo: {
                quantidade: 2,
                dispositivos: [
                    {nome: 'Dispositivo', mac: 'FF:FF:FF:FF:FF:FF'},
                    {nome: 'Dispositivo2', mac: 'AA:AA:AA:AA:AA:AA'}
                ]
            },
            Grupo2: {
                quantidade: 1,
                dispositivos: [
                    {nome: 'Dispositivo', mac: '11:11:11:11:11:11'}
                ]
            }
        };

        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(grupoSalvo));

        deletarDispositivo('Dispositivo', 'FF:FF:FF:FF:FF:FF', 'Grupo');
        
        expect(MMKV.setString).toHaveBeenCalled();

        const dadosSalvos = JSON.parse((MMKV.setString as jest.Mock).mock.calls[0][1]);

        expect(dadosSalvos['Grupo'].quantidade).toBe(1);
        expect(dadosSalvos['Grupo']).toEqual({
            quantidade: 1,
            dispositivos: [
                {nome: 'Dispositivo2', mac: 'AA:AA:AA:AA:AA:AA'}
            ]
        })
    })

    it('Carregando os dispositivos de um grupo', () => {
        const gruposSalvos = {
            Grupo: {
                quantidade: 2,
                dispositivos: [
                    {nome: 'NovoDispositivo', mac: 'FF:FF:FF:FF:FF:FF'},
                    {nome: 'SegundoNovoDispositivo', mac: 'AA:AA:AA:AA:AA:AA'}
                ]
            }
        };

        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(gruposSalvos));
        
        const dispositivos = carregarDispositivos('Grupo');
        
        expect(MMKV.getString).toHaveBeenCalled();

        expect(dispositivos).toHaveLength(2);
        expect(dispositivos[0].nome).toBe('NovoDispositivo');
        expect(dispositivos[1].nome).toBe('SegundoNovoDispositivo');

    });

    //retorna vazio caso nn exista o grupo e os dispostivos
    it('Carregando os dispositivos caso nao exista o grupo', () => {
        const gruposSalvos = {
            Grupo: {
                quantidade: 2,
                dispositivos: [
                    {nome: 'NovoDispositivo', mac: 'FF:FF:FF:FF:FF:FF'},
                    {nome: 'SegundoNovoDispositivo', mac: 'AA:AA:AA:AA:AA:AA'}
                ]
            }
        };

        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(gruposSalvos));
        
        const dispositivos = carregarDispositivos('NovoGrupo');
        
        expect(MMKV.getString).toHaveBeenCalled();

        expect(dispositivos).toEqual([]);

    })

    //Fazer para !grupos[nomeGrupo].dispositivos

    it('Carregando os grupos salvos', () => {
        const gruposSalvos = {
            Grupo1: {
                quantidade: 2,
                dispositivos: [
                    {nome: 'NovoDispositivo', mac: 'FF:FF:FF:FF:FF:FF'},
                    {nome: 'Dispositivo', mac: 'AA:AA:AA:AA:AA:AA'}
                    
                ]
            },
            Grupo2: {
                quantidade: 1,
                dispositivos: [
                    {nome: 'SegundoNovoDispositivo', mac: 'AA:AA:AA:AA:AA:AA'}
                ]
            }
        };

        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(gruposSalvos));

        const dadosSalvos = carregarGrupos();

        expect(dadosSalvos.size).toBe(2);
        expect(dadosSalvos.get('Grupo1')).toBe(2);
        expect(dadosSalvos.get('Grupo2')).toBe(1);
    });

    it('Deletando grupo', () => {
        const grupoSalvo = {
            Grupo: {
                quantidade: 2,
                dispositivos: [
                    {nome: 'Dispositivo', mac: 'FF:FF:FF:FF:FF:FF'},
                    {nome: 'Dispositivo2', mac: 'AA:AA:AA:AA:AA:AA'}
                ]
            },
            Grupo2: {
                quantidade: 1,
                dispositivos: [
                    {nome: 'Dispositivo', mac: '11:11:11:11:11:11'}
                ]
            }
        };

        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(grupoSalvo));

        deletarGrupo('Grupo2');
        
        expect(MMKV.setString).toHaveBeenCalled();

        const dadosSalvos = JSON.parse((MMKV.setString as jest.Mock).mock.calls[0][1]);

        expect(dadosSalvos).toEqual({
            Grupo: {
                quantidade: 2,
                dispositivos: [
                    {nome: 'Dispositivo', mac: 'FF:FF:FF:FF:FF:FF'},
                    {nome: 'Dispositivo2', mac: 'AA:AA:AA:AA:AA:AA'}
                ]
            }
        });
    });

    it("Verificando a quantidade de grupos", () => {
        const grupoSalvo = {
            Grupo: {
                quantidade: 2,
                dispositivos: [
                    {nome: 'Dispositivo', mac: 'FF:FF:FF:FF:FF:FF'},
                    {nome: 'Dispositivo2', mac: 'AA:AA:AA:AA:AA:AA'}
                ]
            },
            Grupo2: {
                quantidade: 1,
                dispositivos: [
                    {nome: 'Dispositivo', mac: '11:11:11:11:11:11'}
                ]
            }
        };

        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(grupoSalvo));

        const valor = verificarQuantidadeGrupos()

        expect(valor).toEqual(true)
    });

    it("Verificando a quantidade de grupos, caso não tenho nada salvo", () => {
    
        (MMKV.getString as jest.Mock).mockReturnValue(null);

        const valor = verificarQuantidadeGrupos()

        expect(valor).toEqual(false)
    });

    it('Deletando cliente', () => {
        const grupoSalvo = {
            Grupo: {
                quantidade: 2,
                dispositivos: [
                    {nome: 'Dispositivo', mac: 'FF:FF:FF:FF:FF:FF'},
                    {nome: 'Dispositivo2', mac: 'AA:AA:AA:AA:AA:AA'}
                ]
            },
            Grupo2: {
                quantidade: 1,
                dispositivos: [
                    {nome: 'Dispositivo', mac: '11:11:11:11:11:11'}
                ]
            }
        };

        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(grupoSalvo));

        deletarCliente('Grupo', 'FF:FF:FF:FF:FF:FF');

        expect(MMKV.setString).toHaveBeenCalled();

        const dadosSalvos = JSON.parse((MMKV.setString as jest.Mock).mock.calls[0][1]);

        expect(dadosSalvos).toEqual({
            Grupo: {
                quantidade: 1,
                dispositivos: [
                    {nome: 'Dispositivo2', mac: 'AA:AA:AA:AA:AA:AA'}
                ]
            },
            Grupo2: {
                quantidade: 1,
                dispositivos: [
                    {nome: 'Dispositivo', mac: '11:11:11:11:11:11'}
                ]
            }
        });
    });

    //FAZER OS TESTES DE ERROS!!
});