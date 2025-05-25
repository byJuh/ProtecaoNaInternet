import { Alert } from "react-native";
import fetchGrupos from "../useCarregarGrupos";

jest.mock("../salvarDispostivos");
jest.mock("react-native-mmkv-storage");

describe('Testando o fetchGrupos', () => {
    const mockSetGrupos = jest.fn();
    const mockSetGruposSelecionados = jest.fn();
    const { carregarGrupos } = require("../salvarDispostivos");

    beforeEach(() =>{
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert');
    })

    it('Carregando os grupos', () => {
        const grupos = new Map<string, number>([
            ['Grupo1', 3],
            ['Grupo2', 0]
        ]);

        (carregarGrupos as jest.Mock).mockReturnValue(grupos);

        fetchGrupos(mockSetGrupos, mockSetGruposSelecionados);

        expect(carregarGrupos).toHaveBeenCalled();
        expect(mockSetGrupos).toHaveBeenCalledWith(grupos);
        
        expect(mockSetGruposSelecionados).not.toHaveBeenCalled();
    });

    it('Carregando os grupos com tamanho 1', () => {
        const grupos = new Map<string, number>([
            ['Grupo1', 3],
        ]);

        (carregarGrupos as jest.Mock).mockReturnValue(grupos);

        fetchGrupos(mockSetGrupos, mockSetGruposSelecionados);

        expect(carregarGrupos).toHaveBeenCalled();

        expect(mockSetGrupos).toHaveBeenCalledWith(grupos);

        expect(grupos.keys().next().value).toBe('Grupo1')
        expect(mockSetGruposSelecionados).toHaveBeenCalledWith(grupos.keys().next().value);
    });

    it('Carregando os grupos com tamanho 0', () => {
        const grupos = new Map<string, number>([]);

        (carregarGrupos as jest.Mock).mockReturnValue(grupos);

        fetchGrupos(mockSetGrupos, mockSetGruposSelecionados);

        expect(carregarGrupos).toHaveBeenCalled();

        expect(mockSetGrupos).toHaveBeenCalledWith(grupos);
        expect(mockSetGruposSelecionados).not.toHaveBeenCalled();
    
    });

    //Lidando com erros
    it('Lidando com erro', () => {
        (carregarGrupos as jest.Mock).mockImplementation(() => {
            throw new Error("Erro ao carregar grupos.");
        });

        fetchGrupos(mockSetGrupos, mockSetGruposSelecionados);

        expect(carregarGrupos).toHaveBeenCalled();
        expect(mockSetGrupos).not.toHaveBeenCalled();
        expect(mockSetGruposSelecionados).not.toHaveBeenCalled();

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao carregar grupos.")
    
    });


})