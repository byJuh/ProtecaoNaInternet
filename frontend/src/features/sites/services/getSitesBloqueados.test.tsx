import { Alert } from "react-native";
import getSitesBloqueados from "./getSitesBloqueados";

jest.mock("./salvarSitesBloqueados");
jest.mock("react-native-mmkv-storage");

describe('Testando getSitesBloqueados', () => {
    const mockSetSites = jest.fn();
    const { carregarSitesBloqueadosDoGrupo } = require("./salvarSitesBloqueados");

    beforeEach(() =>{
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert');
    })

    it('Carregando sites bloqueados de um grupo', () => {
        const nomeGrupo = "Grupo1";
        const sitesBloqueados = ['site1.com', 'site2.com', 'site3.com'];

        (carregarSitesBloqueadosDoGrupo as jest.Mock).mockReturnValue(sitesBloqueados);

        getSitesBloqueados(nomeGrupo, mockSetSites);

        expect(carregarSitesBloqueadosDoGrupo).toHaveBeenCalledWith(nomeGrupo);
        expect(mockSetSites).toHaveBeenCalledWith(sitesBloqueados);
    } );

    //Lidando com erros
    it('Lidando com erro', () => {
        const nomeGrupo = "Grupo1";

        (carregarSitesBloqueadosDoGrupo as jest.Mock).mockImplementation(() => {
            throw new Error("Erro ao carregar sites bloqueados.");
        });

        getSitesBloqueados(nomeGrupo, mockSetSites);

        expect(carregarSitesBloqueadosDoGrupo).toHaveBeenCalledWith(nomeGrupo);
        expect(mockSetSites).not.toHaveBeenCalled();
    });

    it('Não definindo sites quando nenhum site bloqueado é retornado', () => {
        const nomeGrupo = "Grupo1";

        (carregarSitesBloqueadosDoGrupo as jest.Mock).mockReturnValue(undefined);

        getSitesBloqueados(nomeGrupo, mockSetSites);

        expect(carregarSitesBloqueadosDoGrupo).toHaveBeenCalledWith(nomeGrupo);
        expect(mockSetSites).not.toHaveBeenCalled();
    }); 

    it('Lidando com erro que não é uma instância de Error', () => {
        const nomeGrupo = "Grupo1";

        (carregarSitesBloqueadosDoGrupo as jest.Mock).mockImplementation(() => {
            throw "Erro desconhecido";
        });

        getSitesBloqueados(nomeGrupo, mockSetSites);

        expect(carregarSitesBloqueadosDoGrupo).toHaveBeenCalledWith(nomeGrupo);
        expect(mockSetSites).not.toHaveBeenCalled();
    });
})