import React from "react";
import HomeScreen from "./Home";
import { fireEvent, render } from "@testing-library/react-native";

jest.mock('@react-navigation/native-stack');
jest.mock("react-native-mmkv-storage");
jest.mock("../../services/salvarDispostivos");

const mockNavigate = jest.fn();
const mockReplace= jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    replace: mockReplace
  })
}));

describe('Testando a telas Home', () => {

    const { verificarQuantidadeGrupos } = require("../../services/salvarDispostivos");

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error');
    })

    it('Renderizando a tela', () => {
        const { getByRole } = render(<HomeScreen />);
        
        expect(getByRole('button', {name: 'Começar'})).toBeTruthy();
    });

    it('Testando o funcionamento da tela (possui grupos)', () => {
        mockReplace.mockClear();

        (verificarQuantidadeGrupos as jest.Mock).mockReturnValue(true);

        const { getByRole } = render(<HomeScreen />);
        
        const button = getByRole('button', {name: 'Começar'});
        expect(button).toBeTruthy();

        //chama a funcao -> mudando tela
        fireEvent.press(button);
        expect(verificarQuantidadeGrupos).toHaveBeenCalled();
        
        expect(mockReplace).toHaveBeenCalledWith('Tabs', {screen: 'Bloquear'});
        expect(mockNavigate).not.toHaveBeenCalledWith('Tela_Explicacao');
    });

    it('Testando o funcionamento da tela (nao possui grupos)', () => {
        mockReplace.mockClear();

        (verificarQuantidadeGrupos as jest.Mock).mockReturnValue(false);

        const { getByRole } = render(<HomeScreen />);
        
        const button = getByRole('button', {name: 'Começar'});
        expect(button).toBeTruthy();

        //chama a funcao -> mudando tela
        fireEvent.press(button);
        expect(verificarQuantidadeGrupos).toHaveBeenCalled();
        
        expect(mockReplace).not.toHaveBeenCalledWith('Tabs', {screen: 'Bloquear'});
        expect(mockNavigate).toHaveBeenCalledWith('Tela_Explicacao');
    });

    it('Testando o funcionamento da tela -> Erro', () => {
        mockReplace.mockClear();

        (verificarQuantidadeGrupos as jest.Mock).mockImplementation(() => {
            throw new Error("Erro ao carregar grupos.");
        });

        const { getByRole } = render(<HomeScreen />);
        
        const button = getByRole('button', {name: 'Começar'});
        expect(button).toBeTruthy();

        //chama a funcao -> mudando tela
        fireEvent.press(button);
        expect(verificarQuantidadeGrupos).toHaveBeenCalled();
        
        expect(mockReplace).not.toHaveBeenCalledWith('Tabs', {screen: 'Bloquear'});
        expect(mockNavigate).not.toHaveBeenCalledWith('Tela_Explicacao');

        
        expect(console.error).toHaveBeenCalledWith("Erro ao verificar");
    });
})

