import { Alert } from "react-native";
import pegandoRegistros from "../useCarregarListaDeSites";
import { Registro } from "../../utils/types";

jest.mock("../requests");

describe('Testando pegando registros', () => {
    const mockSetRegistros = jest.fn();
    const { getRegistro } = require('../requests');

     beforeEach(() =>{
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert');
    });

    it('Pegando os registros', async () => {
        const registro = ['www.google.com.br', 'www.uol.com.br', 'www.terra.com.br', 'www.youtube.com.br'];

        (getRegistro as jest.Mock).mockResolvedValue(registro);

        await pegandoRegistros(mockSetRegistros, 'FF:FF:FF:FF:FF:FF');

        expect(getRegistro).toHaveBeenCalledWith('FF:FF:FF:FF:FF:FF');
        expect(mockSetRegistros).toHaveBeenCalledWith(registro);

    });

    it('Registros com tamanho 0', async () => {
        const registro: Registro[] = [];

        (getRegistro as jest.Mock).mockResolvedValue(registro);

        await pegandoRegistros(mockSetRegistros, 'FF:FF:FF:FF:FF:FF');

        expect(getRegistro).toHaveBeenCalledWith('FF:FF:FF:FF:FF:FF');
        expect(mockSetRegistros).not.toHaveBeenCalled();

    });

    it('Lidando com erros', async () => {
        (getRegistro as jest.Mock).mockImplementation(() => {
            throw new Error("Erro de rede: Network Request Failed");
        });
        
        await pegandoRegistros(mockSetRegistros, 'FF:FF:FF:FF:FF:FF');
        
        expect(getRegistro).toHaveBeenCalled();
        expect(mockSetRegistros).not.toHaveBeenCalled();

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro de rede: Network Request Failed")
    
    });

});

