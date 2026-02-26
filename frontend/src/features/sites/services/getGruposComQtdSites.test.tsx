import { Alert } from "react-native";
import getGruposComQuantidadesDeSitesBloqueados from "./getGruposComQtdSites";

jest.mock("./salvarSitesBloqueados");
jest.mock("react-native-mmkv-storage");

describe('Testando getGruposComQuantidadesDeSitesBloqueados', () => {
    const mockSetGrupos = jest.fn();
    const { carregarGruposComQuantidadesDeSitesBloqueados } = require("./salvarSitesBloqueados");

    beforeEach(() =>{
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert');
    })

    it('Carregando grupos com quantidade de sites bloqueados', () => {
        const mapGrupos = new Map<string, number>([
            ['Grupo1', 5],
            ['Grupo2', 10]
        ]);
        const gruposQtd: [string, number][] = [['Grupo1', 5], ['Grupo2', 10]];

        (carregarGruposComQuantidadesDeSitesBloqueados as jest.Mock).mockReturnValue(mapGrupos);

        getGruposComQuantidadesDeSitesBloqueados(mockSetGrupos);

        expect(carregarGruposComQuantidadesDeSitesBloqueados).toHaveBeenCalled();
        expect(mockSetGrupos).toHaveBeenCalledWith(gruposQtd);
    });

    //Lidando com erros
    it('Lidando com erro', () => {
        (carregarGruposComQuantidadesDeSitesBloqueados as jest.Mock).mockImplementation(() => {
            throw new Error("Erro ao carregar grupos.");
        });

        getGruposComQuantidadesDeSitesBloqueados(mockSetGrupos);

        expect(carregarGruposComQuantidadesDeSitesBloqueados).toHaveBeenCalled();
        expect(mockSetGrupos).not.toHaveBeenCalled();
    });
})