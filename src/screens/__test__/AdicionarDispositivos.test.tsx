import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Dispositivo, RootStackParamList } from "../../utils/types";
import AdicionarDispositivos from "../AdicionarDispositivos";
import getDispositivos from "../../services/useCarregarDispositivos";

jest.mock("react-native-mmkv-storage");
jest.mock('@react-navigation/native-stack');
jest.mock('../../services/requests');
jest.mock('../../services/useCarregarDispositivos');
jest.mock('react-native-picker-select', () => 'RNPickerSelect');

const mockReplace= jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace
  })
}));

describe('Testando tela de adicionar dispositivos', () => {
    const mockRoute: RouteProp<RootStackParamList, 'Adicionar_Dispositivo'> = {
        key: 'any-key',
        name: 'Adicionar_Dispositivo',
        params: {
            nomeGrupo: 'Grupo',
        },
    };

    beforeEach(() => {
        jest.spyOn(Alert, 'alert');
        jest.clearAllMocks();
    });

    it('Renderizando a tela', () => {
        const {getByText, getByTestId, getByRole } = render(<AdicionarDispositivos route={mockRoute} />);
    
        expect(getByTestId('list-dispositivos')).toBeTruthy();
        expect(getByText('Nenhum dispositivo cadastrado.')).toBeTruthy();

        expect(getByRole('button', {name: 'Novo MAC'})).toBeTruthy();
        expect(getByText('Novo MAC')).toBeTruthy();

        expect(getByRole('button', {name: 'Excluir Mac'})).toBeTruthy();
        expect(getByText('Excluir Mac')).toBeTruthy();
    });

    it('Testando o funcionamento da tela (pressionar botão de adicionar)', () => {
        const dispositivos: Dispositivo[] = [{
            nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'
        }];

        (getDispositivos as jest.Mock).mockImplementation((nomeGrupo, setDispositivos) => {
            setDispositivos(dispositivos);
        });

        const {getByText, getByTestId, getByRole } = render(<AdicionarDispositivos route={mockRoute} />);

        expect(getDispositivos).toHaveBeenCalled();

        const flatList = getByTestId('list-dispositivos');
        expect(flatList.props.data).toBe(dispositivos);

        expect(getByTestId('text-Filho')).toBeTruthy();
        expect(getByTestId('text-FF:FF:FF:FF:FF:FF')).toBeTruthy();

        const button = getByRole('button', {name: 'Novo MAC'});
        fireEvent.press(button);

        const nomeGrupo = mockRoute.params.nomeGrupo
        expect(mockReplace).toHaveBeenCalledWith('Cadastrar_Mac', {nomeGrupo});

        expect(getByRole('button', {name: 'Excluir Mac'})).toBeTruthy();
        expect(getByText('Excluir Mac')).toBeTruthy();

        expect(mockReplace).not.toHaveBeenCalledWith('Excluir_Mac', {nomeGrupo});


    });

    it('Testando o funcionamento da tela (pressionar botão de excluir)', () => {
        const dispositivos: Dispositivo[] = [{
            nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'
        }];

        (getDispositivos as jest.Mock).mockImplementation((nomeGrupo, setDispositivos) => {
            setDispositivos(dispositivos);
        });

        const {getByText, getByTestId, getByRole } = render(<AdicionarDispositivos route={mockRoute} />);

        expect(getDispositivos).toHaveBeenCalled();

        const flatList = getByTestId('list-dispositivos');
        expect(flatList.props.data).toBe(dispositivos);

        expect(getByTestId('text-Filho')).toBeTruthy();
        expect(getByTestId('text-FF:FF:FF:FF:FF:FF')).toBeTruthy();

        expect(getByRole('button', {name: 'Novo MAC'})).toBeTruthy();
        expect(getByText('Novo MAC')).toBeTruthy();

        const button = getByRole('button', {name: 'Excluir Mac'})
        fireEvent.press(button);

        const nomeGrupo = mockRoute.params.nomeGrupo
        expect(mockReplace).toHaveBeenCalledWith('Excluir_Mac', {nomeGrupo});

        expect(mockReplace).not.toHaveBeenCalledWith('Cadastrar_Mac', {nomeGrupo});
    });
});