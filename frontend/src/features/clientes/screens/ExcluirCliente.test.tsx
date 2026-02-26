import { fireEvent, render, waitFor } from "@testing-library/react-native";
import ExcluirGrupo from "../../grupos/screens/ExcluirGrupo";
import RNPickerSelect from 'react-native-picker-select';
import { Alert } from "react-native";
import { Dispositivo, RootStackParamList } from "../../../utils/types";
import Excluir_cliente from "./ExcluirCliente";
import { RouteProp } from "@react-navigation/native";
import getDispositivos from "../../../services/useCarregarDispositivos";
import React from "react";
import { deletarCliente } from "../../../services/salvarDispostivos";
import { deleteClient } from "../../../services/requests";

jest.mock("react-native-mmkv-storage");
jest.mock("../../services/useCarregarDispositivos");
jest.mock('@react-navigation/native-stack');
jest.mock('../../services/requests')

jest.mock('../../services/salvarDispostivos');

jest.mock('react-native-picker-select', () => 'RNPickerSelect');

const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace 
  })
}));

describe("Testando a tela excluir cliente", () => {

    beforeEach(() => {
        jest.spyOn(Alert, 'alert');
        jest.clearAllMocks();
    });

    it('Renderizando a tela excluir cliente', () => {
        const mockRoute: RouteProp<RootStackParamList, 'Excluir_Mac'> = {
            key: 'any-key',
            name: 'Excluir_Mac',
            params: {
                nomeGrupo: 'Grupo2',
            },
        };

        const {getByText, getByTestId, getByRole } = render(<Excluir_cliente route={mockRoute} />);

        expect(getByTestId('picker-dispositivo').findByType(RNPickerSelect)).toBeTruthy();
        expect(getByRole('button', {name: 'Excluir'})).toBeTruthy();
        expect(getByText('Excluir')).toBeTruthy();
        
    });

    it('Testando o funcionamento da tela', async () => {
        const mockRoute: RouteProp<RootStackParamList, 'Excluir_Mac'> = {
            key: 'any-key',
            name: 'Excluir_Mac',
            params: {
                nomeGrupo: 'Grupo2',
            },
        };

        const dispositivos: Dispositivo[] = [
            {nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'},
            {nome:'Filho2', mac: 'AA:AA:AA:AA:AA:AA'}
        ];

        (getDispositivos as jest.Mock).mockImplementation((nomeGrupo, setDispositivos) => {
            setDispositivos(dispositivos);
        });
        (deleteClient as jest.Mock).mockResolvedValue('Cliente FF:FF:FF:FF:FF:FF foi removido');
        (deletarCliente as jest.Mock).mockImplementation(() => {});

        const { getByTestId, getByRole } = render(<Excluir_cliente route={mockRoute} />);
        const nomeGrupo = mockRoute.params.nomeGrupo;

        expect(getDispositivos).toHaveBeenCalled();
        
        const select = getByTestId('picker-dispositivo').findByType(RNPickerSelect);
        fireEvent(select, 'onValueChange', 'FF:FF:FF:FF:FF:FF');

        expect(select.props.value).toBe('FF:FF:FF:FF:FF:FF');
        const macAddress = select.props.value;

        const button = getByRole('button', {name: 'Excluir'});
        fireEvent.press(button);

        expect(deleteClient).toHaveBeenCalledWith(macAddress, nomeGrupo);
        
        //precisa esperar para terminar
        await waitFor(() => {
            expect(deletarCliente).toHaveBeenCalledWith(nomeGrupo, macAddress);
        })
        
        expect(Alert.alert).toHaveBeenCalledWith('Removido', 'Dispositivo de MAC: FF:FF:FF:FF:FF:FF foi removido!');

        expect(mockReplace).toHaveBeenCalledWith('Tabs', { screen: 'Bloquear' });

    });

    it('Testando erro de excluir dispositivo', async () => {
        const mockRoute: RouteProp<RootStackParamList, 'Excluir_Mac'> = {
            key: 'any-key',
            name: 'Excluir_Mac',
            params: {
                nomeGrupo: 'Grupo2',
            },
        };

        const dispositivos: Dispositivo[] = [
            {nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'},
            {nome:'Filho2', mac: 'AA:AA:AA:AA:AA:AA'}
        ];

        
        (deletarCliente as jest.Mock).mockImplementation(() => {});
        (getDispositivos as jest.Mock).mockImplementation((nomeGrupo, setDispositivos) => {
            setDispositivos(dispositivos);
        });
        (deleteClient as jest.Mock).mockImplementation(() => {
            throw new Error("Erro de rede: Network Request Failed");
        });

        const { getByTestId, getByRole } = render(<Excluir_cliente route={mockRoute} />);
        const nomeGrupo = mockRoute.params.nomeGrupo;

        expect(getDispositivos).toHaveBeenCalled();
        
        const select = getByTestId('picker-dispositivo').findByType(RNPickerSelect);
        fireEvent(select, 'onValueChange', 'FF:FF:FF:FF:FF:FF');

        expect(select.props.value).toBe('FF:FF:FF:FF:FF:FF');
        const macAddress = select.props.value;

        const button = getByRole('button', {name: 'Excluir'});
        fireEvent.press(button);

        expect(deleteClient).toHaveBeenCalledWith(macAddress, nomeGrupo);

        expect(deletarCliente).not.toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith("Não foi possível remover!!");

        expect(mockReplace).not.toHaveBeenCalled();

    });
});