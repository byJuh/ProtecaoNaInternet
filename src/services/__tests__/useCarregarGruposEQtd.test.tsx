import { Alert } from "react-native";
import getGruposQtdDispositivos from "../useCarregarGruposEQtd";

jest.mock("../salvarDispostivos");
jest.mock("react-native-mmkv-storage");

describe('Testando getGruposQtdDispositivos', () => {
    const mockSetGrupos = jest.fn();
    const { carregarGrupos } = require("../salvarDispostivos");
    
    beforeEach(() =>{
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert');
    })

    it('Carregando grupos com quantidade de dispositivos', () => {
        const mapGrupos = new Map<string, number>([
            ['Grupo1', 2],
            ['Grupo2', 3]
        ]);
        const gruposQtd: [string, number][] = [['Grupo1', 2], ['Grupo2', 3]];

        (carregarGrupos as jest.Mock).mockReturnValue(mapGrupos);

        getGruposQtdDispositivos(mockSetGrupos);

        expect(carregarGrupos).toHaveBeenCalled();
        expect(mockSetGrupos).toHaveBeenCalledWith(gruposQtd);
    });

    //Lidando com erros
    it('Lidando com erro', () => {
        (carregarGrupos as jest.Mock).mockImplementation(() => {
            throw new Error("Erro ao carregar grupos.");
        });

        getGruposQtdDispositivos(mockSetGrupos);

        expect(carregarGrupos).toHaveBeenCalled();
        expect(mockSetGrupos).not.toHaveBeenCalled();
    });
})