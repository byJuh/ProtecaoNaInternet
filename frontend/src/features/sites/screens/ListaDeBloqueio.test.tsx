import React from "react";
import getGruposComQuantidadesDeSitesBloqueados from "../services/getGruposComQtdSites";
import ListaDeBloqueio from "./ListaDeBloqueio";
import { fireEvent, render, within } from "@testing-library/react-native";

jest.mock("react-native-mmkv-storage");
jest.mock('@react-navigation/native-stack');
jest.mock('../services/getGruposComQtdSites');

const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace
  })
}));


describe('Testando a rela Lista de Bloqueio', () => {

    it('Renderizando a tela', () => {
        const {getByText, getByTestId, getByRole } = render(<ListaDeBloqueio />);

        expect(getByTestId('visualizar-grupos-sites-bloqueados')).toBeTruthy();
    });

    it('Testando o funcionamento da tela', () => {
        mockReplace.mockClear();

        const mapGrupos = new Map<string, number>([
                ['Grupo1', 2],
                ['Grupo2', 3]
            ]);

        (getGruposComQuantidadesDeSitesBloqueados as jest.Mock).mockImplementation((setGrupos) => {
            setGrupos(Array.from(mapGrupos));
        });

        const { getByTestId } = render(<ListaDeBloqueio />);

        const visualizar = getByTestId('visualizar-grupos-sites-bloqueados');
        expect(visualizar).toBeTruthy();

        expect(visualizar.props.data).toEqual(Array.from(mapGrupos))
        
        const btn1 = within(visualizar).getByText('Grupo1');
        const btn2 = within(visualizar).getByText('Grupo2');
        
        expect(btn1).toBeTruthy();
        expect(btn2).toBeTruthy();

        fireEvent.press(btn1);

        expect(mockReplace).toHaveBeenCalledWith('Desbloquear_Sites', {"nomeGrupo": 'Grupo1'});
        
    });
});
