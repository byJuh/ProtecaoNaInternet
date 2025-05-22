import React from "react";
import { fireEvent, render, waitFor, screen } from "@testing-library/react-native";
import Bloquear from "../Bloquear";
import { addDomainBlocklist } from "../../services/requests_antigo";
import useCarregarGrupos from "../../services/useCarregarGrupos";

jest.mock('../../services/useCarregarGrupos');
jest.mock('../../services/useCarregarDispositivosMacAddress', () => jest.fn());
jest.mock('../../services/useCarregarListaDeSites', () => jest.fn());
jest.mock('../../services/requests', () => ({
    addDomainBlocklist: jest.fn().mockResolvedValue(true),
}));

describe("Bloquear", () => {
    test("renderizar tela", async () => {
        const mockUseCarregarGrupos = useCarregarGrupos as jest.Mock;
        
        const {getByTestId, getByText} = render(
            <Bloquear />
        )

        mockUseCarregarGrupos.mockReturnValue(new Map<string, number>([['filhos', 1]]))

        await waitFor(() => {
            expect(getByText('Bloquear')).toBeTruthy();
            expect(getByTestId('picker-grupos')).toBeTruthy();

            fireEvent(getByTestId('picker-grupos'), 'valueChange', '1');
        })

        await waitFor(() => {
            expect(getByTestId('picker-dispositivos')).toBeTruthy();
        })
    });

    test("pegando valores", () => {
    
    })
    
})

