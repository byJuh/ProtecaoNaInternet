import React from "react";
import { fireEvent, render, waitFor, screen } from "@testing-library/react-native";
import { salvarDispositivos, carregarDispositivos, carregarGrupos } from "../salvarDispositivos_antigo";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('Testes de armazenamento de dispositivos', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Salvando um dispositivo em um novo grupo', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        //Simulando a chamada da funcao, adicionando um dispositivo
        await salvarDispositivos('NovoDispositivo', 'FF:FF:FF:FF:FF:FF', 'NovoGrupo');
        
        //espera que o item seja salvo
        expect(AsyncStorage.setItem).toHaveBeenCalled();
        
        const dadosSalvos = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
        
        expect(dadosSalvos['NovoGrupo']).toEqual({
            quantidade: 1,
            dispositivos: [
                {nome: 'NovoDispositivo', mac: 'FF:FF:FF:FF:FF:FF'}
            ]
        });
    });

    it('Salvando um dispositivo em um grupo existente', async () => {
        const grupoSalvo = {
            Grupo: {
                quantidade: 1,
                dispositivos: [
                    {nome: 'NovoDispositivo', mac: 'FF:FF:FF:FF:FF:FF'}
                ]
            }
        };

        //simulando que ja tem grupo salvo
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(grupoSalvo))
        
        await salvarDispositivos('SegundoNovoDispositivo', 'AA:AA:AA:AA:AA:AA', 'Grupo');

        expect(AsyncStorage.setItem).toHaveBeenCalled();

        const dadosSalvos = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);

        expect(dadosSalvos['Grupo'].quantidade).toBe(2);
        expect(dadosSalvos['Grupo']).toEqual({
            quantidade: 2,
            dispositivos: [
                {nome: 'NovoDispositivo', mac: 'FF:FF:FF:FF:FF:FF'},
                {nome: 'SegundoNovoDispositivo', mac: 'AA:AA:AA:AA:AA:AA'}
            ]
        })
    });

    it('Carregando os dispositivos de um grupo', async () => {
        const gruposSalvos = {
            Grupo: {
                quantidade: 2,
                dispositivos: [
                    {nome: 'NovoDispositivo', mac: 'FF:FF:FF:FF:FF:FF'},
                    {nome: 'SegundoNovoDispositivo', mac: 'AA:AA:AA:AA:AA:AA'}
                ]
            }
        };

        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(gruposSalvos));
        
        const dispositivos = await carregarDispositivos('Grupo');
        
        expect(AsyncStorage.getItem).toHaveBeenCalled();

        expect(dispositivos).toHaveLength(2);
        expect(dispositivos[0].nome).toBe('NovoDispositivo');
        expect(dispositivos[1].nome).toBe('SegundoNovoDispositivo');

    });

    it('Carregando os grupos salvos', async() => {
        const gruposSalvos = {
            'Grupo1': {
                quantidade: 2,
                dispositivos: [
                    {nome: 'NovoDispositivo', mac: 'FF:FF:FF:FF:FF:FF'},
                    {nome: 'Dispositivo', mac: 'AA:AA:AA:AA:AA:AA'}
                    
                ]
            },
            'Grupo2': {
                quantidade: 1,
                dispositivos: [
                    {nome: 'SegundoNovoDispositivo', mac: 'AA:AA:AA:AA:AA:AA'}
                ]
            }
        };

        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(gruposSalvos));

        const dadosSalvos = await carregarGrupos();

        expect(dadosSalvos.size).toBe(2);
        expect(dadosSalvos.get('Grupo1')).toBe(2);
        expect(dadosSalvos.get('Grupo2')).toBe(1);
    });

    //FAZER OS TESTES DE ERROS!!
});