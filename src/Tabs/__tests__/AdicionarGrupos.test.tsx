import React from "react";
import getGruposQtdDispositivos from "../../services/useCarregarGruposEQtd";
import AdicionarGrupos from "../AdicionarGrupos";
import { fireEvent, render, within } from "@testing-library/react-native";

jest.mock("react-native-mmkv-storage");
jest.mock('@react-navigation/native-stack');
jest.mock('../../services/useCarregarGruposEQtd');

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('Testando a rela Adicionar Grupos', () => {
    it('Renderizando a tela', () => {
        const {getByText, getByTestId, getByRole } = render(<AdicionarGrupos />);
        
        expect(getByTestId('visualizar-grupos')).toBeTruthy();
        expect(getByRole('button', {name: 'Novo Grupo'})).toBeTruthy();
        expect(getByRole('button', {name: 'Excluir Grupo'})).toBeTruthy();
        expect(getByText('Novo Grupo')).toBeTruthy();
        expect(getByText('Excluir Grupo')).toBeTruthy();
    });
});

describe('Testando o funcionamento da tela', () => {
   it('Cadastrando um novo grupo', () => {
        const { getByRole } = render(<AdicionarGrupos />);

        const cadastrar = getByRole('button', {name: 'Novo Grupo'});
        
        fireEvent.press(cadastrar);
        expect(mockNavigate).toHaveBeenCalledWith('Cadastrar_Grupo');


        expect(mockNavigate).not.toHaveBeenCalledWith('Excluir_Grupo');
        expect(mockNavigate).not.toHaveBeenCalledWith('Adicionar_Dispositivo');
   });

   it('Excluindo um cliente', () => {
        mockNavigate.mockClear();

        const { getByRole } = render(<AdicionarGrupos />);

        const excluir = getByRole('button', {name: 'Excluir Grupo'});
        
        fireEvent.press(excluir);
        expect(mockNavigate).toHaveBeenCalledWith('Excluir_Grupo');

        expect(mockNavigate).not.toHaveBeenCalledWith('Cadastrar_Grupo');
        expect(mockNavigate).not.toHaveBeenCalledWith('Adicionar_Dispositivo');

   });

   it('Adicionando um novo dispositivo', async () => {
        mockNavigate.mockClear();

        const mapGrupos = new Map<string, number>([
                ['Grupo1', 2],
                ['Grupo2', 3]
            ]);

        (getGruposQtdDispositivos as jest.Mock).mockImplementation((setGrupos) => {
            setGrupos(Array.from(mapGrupos));
        });

        const { getByTestId, getByText, findByText } = render(<AdicionarGrupos />);

        const visualizar = getByTestId('visualizar-grupos');
        expect(visualizar).toBeTruthy();

        expect(visualizar.props.data).toEqual(Array.from(mapGrupos))

        const btn1 = within(visualizar).getByText('Grupo1');
        const btn2 = within(visualizar).getByText('Grupo2');

        expect(btn1).toBeTruthy();
        expect(btn2).toBeTruthy();

        fireEvent.press(btn1)

        expect(mockNavigate).toHaveBeenCalledWith('Adicionar_Dispositivo', {"nomeGrupo": 'Grupo1'})

        //Selecionar dispositivo -> como testar
        expect(mockNavigate).not.toHaveBeenCalledWith('Cadastrar_Grupo');
        expect(mockNavigate).not.toHaveBeenCalledWith('Excluir_Grupo');

   });
});

