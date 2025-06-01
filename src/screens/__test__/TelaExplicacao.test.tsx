import React from "react";
import TelaExplicacao from "../TelaExplicação";
import { fireEvent, render } from "@testing-library/react-native";

jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('@react-navigation/native-stack');

const mockNavigate = jest.fn();
const mockReplace= jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    replace: mockReplace
  })
}));

describe('Testando a tela explicacao', () => {

    beforeEach(() => {
        mockNavigate.mockClear();
        mockReplace.mockClear();
        jest.clearAllMocks();
    })

    it('Renderizando a tela', () => {

        const { getByRole, getByLabelText, getByText } = render(<TelaExplicacao />);

        const text = `Criando Grupos: \n\n \t 1. Os grupos servem para organizações dos dispositvos. \n\n \t 2. Primeiramente será criado um grupo e um disposivo desse grupo.`
        
        expect(getByLabelText("Voltar para Home")).toBeTruthy();
        expect(getByText("Criando Grupo de Dispositivos")).toBeTruthy();
        expect(getByText(text)).toBeTruthy();
        expect(getByRole('button', {name: 'Continuar'})).toBeTruthy();

    });

    it('Renderizando a tela (voltando para a home)', () => {

        const { getByLabelText } = render(<TelaExplicacao />);

        const button = getByLabelText("Voltar para Home");
        fireEvent.press(button);

        expect(mockReplace).toHaveBeenCalledWith('Home');

    });

     it('Renderizando a tela (avançando para cadastrar grupo)', () => {
        const { getByRole } = render(<TelaExplicacao />);

        const button = getByRole('button', {name: 'Continuar'});
        fireEvent.press(button);

        expect(mockNavigate).toHaveBeenCalledWith('Cadastrar_Grupo');
        expect(mockReplace).not.toHaveBeenCalledWith('Home');

    });
})