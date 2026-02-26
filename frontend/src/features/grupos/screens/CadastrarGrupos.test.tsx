import React from "react";
import { carregarGrupos } from "../../../services/salvarDispostivos";
import { createGroup } from "../../../services/requests";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import CadastrarGrupos from "./CadastrarGrupos";

jest.mock("react-native-mmkv-storage");
jest.mock('@react-navigation/native-stack');
jest.mock('../../services/requests');
jest.mock('../../services/salvarDispostivos');
jest.mock('react-native-picker-select', () => 'RNPickerSelect');

const mockReplace= jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace
  })
}));

describe('Testando a tela cadastrar grupos', () => {

    beforeEach(() => {
        jest.spyOn(Alert, 'alert');
        jest.clearAllMocks();
    });

    it('Renderizando a tela', () => {
        
        const {getByText, getByTestId, getByRole } = render(<CadastrarGrupos />);

        expect(getByTestId('input-nomeGrupo')).toBeTruthy();
        expect(getByRole('button', {name: 'Criar Grupo'})).toBeTruthy();
        expect(getByText('Criar Grupo')).toBeTruthy();
        
    });

    it('Testando o funcionamento da tela', async () => {

        const grupos = new Map<string, number> ([
            ['Grupo1', 3],
            ['Grupo2', 0]
        ]);

        (carregarGrupos as jest.Mock).mockReturnValue(grupos);
        (createGroup as jest.Mock).mockResolvedValue('Grupo Família criado com sucesso');

        const {getByText, getByTestId, getByRole } = render(<CadastrarGrupos />);

        const nomeGrupo = 'Família';

        const textInput = getByTestId('input-nomeGrupo');
        fireEvent.changeText(textInput, nomeGrupo);
        expect(textInput.props.value).toBe(nomeGrupo);

        const button = getByRole('button', {name: 'Criar Grupo'});
        fireEvent.press(button);

        expect(carregarGrupos).toHaveBeenCalled();

        await waitFor(() => {
            expect(createGroup).toHaveBeenCalledWith(nomeGrupo);
        })
        
        expect(Alert.alert).toHaveBeenCalledWith('Grupo Família criado com sucesso');
        expect(mockReplace).toHaveBeenCalledWith('Cadastrar_Mac', {nomeGrupo: nomeGrupo});
    });

    it('Testando erro de campo vazio', async () => {

        const { getByTestId, getByRole } = render(<CadastrarGrupos />);

        const textInput = getByTestId('input-nomeGrupo');
        fireEvent.changeText(textInput, '');
        expect(textInput.props.value).toBe('');

        const button = getByRole('button', {name: 'Criar Grupo'});
        fireEvent.press(button);

        expect(carregarGrupos).not.toHaveBeenCalled();
        expect(createGroup).not.toHaveBeenCalled();

        expect(Alert.alert).toHaveBeenCalledWith("Preencha o campo vazio!!");
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('Testando erro de nome existente', async () => {

        const grupos = new Map<string, number> ([
            ['Grupo1', 3],
            ['Grupo2', 0],
            ['Família', 1]
        ]);

        (carregarGrupos as jest.Mock).mockReturnValue(grupos);
        (createGroup as jest.Mock).mockResolvedValue('O grupo Família já existe!');

        const { getByTestId, getByRole } = render(<CadastrarGrupos />);

        const textInput = getByTestId('input-nomeGrupo');
        fireEvent.changeText(textInput, 'Família');
        expect(textInput.props.value).toBe('Família');

        const button = getByRole('button', {name: 'Criar Grupo'});
        fireEvent.press(button);

        expect(carregarGrupos).toHaveBeenCalled();
        expect(createGroup).not.toHaveBeenCalled();

        expect(Alert.alert).toHaveBeenCalledWith("Esse grupo já existe!!");
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('Testando erro ao carregar grupos', async () => {

        const grupos = new Map<string, number> ([
            ['Grupo1', 3],
            ['Grupo2', 0]
        ]);

        (carregarGrupos as jest.Mock).mockImplementation(() => {
            throw new Error("Erro ao carregar grupos.")
        })

        const { getByTestId, getByRole } = render(<CadastrarGrupos />);

        const textInput = getByTestId('input-nomeGrupo');
        fireEvent.changeText(textInput, 'Família');
        expect(textInput.props.value).toBe('Família');

        const button = getByRole('button', {name: 'Criar Grupo'});
        fireEvent.press(button);

        expect(carregarGrupos).toHaveBeenCalled();
        expect(createGroup).not.toHaveBeenCalled();

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao carregar grupos.");
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('Testando erro ao carregar grupos', async () => {

        const grupos = new Map<string, number> ([
            ['Grupo1', 3],
            ['Grupo2', 0]
        ]);

        (carregarGrupos as jest.Mock).mockReturnValue(grupos);
        (createGroup as jest.Mock).mockImplementation(() => {
            throw new Error("Erro de rede: Network Request Failed");
        });

        const { getByTestId, getByRole } = render(<CadastrarGrupos />);

        const textInput = getByTestId('input-nomeGrupo');
        fireEvent.changeText(textInput, 'Família');
        expect(textInput.props.value).toBe('Família');

        const button = getByRole('button', {name: 'Criar Grupo'});
        fireEvent.press(button);

        expect(carregarGrupos).toHaveBeenCalled();
        expect(createGroup).toHaveBeenCalledWith('Família');

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro de rede: Network Request Failed");
        expect(mockReplace).not.toHaveBeenCalled();
    });
});