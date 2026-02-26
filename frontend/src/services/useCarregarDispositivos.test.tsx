import { Alert } from "react-native";
import { Dispositivo } from "../utils/types";
import getDispositivos from "./useCarregarDispositivos";

jest.mock("./salvarDispostivos");
jest.mock("react-native-mmkv-storage");

describe('Testando o getDispositivo', () => {
    const mockSetDispositivos = jest.fn();
    const { carregarDispositivos } = require("./salvarDispostivos");

    beforeEach(() =>{
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert');
    })

    it('Carregando os dispositivos registrado', () => {
        const dispositivos: Dispositivo[] = [{
            nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'
        }];

        
        (carregarDispositivos as jest.Mock).mockReturnValue(dispositivos);

        getDispositivos('Grupo', mockSetDispositivos)
        
        expect(carregarDispositivos).toHaveBeenCalledWith("Grupo")
        expect(mockSetDispositivos).toHaveBeenCalledWith(dispositivos)
        
    });

    it('Lidando com valor vazio', () => {
        (carregarDispositivos as jest.Mock).mockReturnValue([]);

        getDispositivos('Grupo', mockSetDispositivos)
        
        expect(carregarDispositivos).toHaveBeenCalledWith("Grupo")
        expect(mockSetDispositivos).toHaveBeenCalledWith([]);
    });

    //Lidar com erros
    it('Lidando com erro de JSON', () => {
        (carregarDispositivos as jest.Mock).mockImplementation(() => {
            throw new Error("Erro ao carregar os dispositivos.");
        });

        getDispositivos('Grupo', mockSetDispositivos)
        
        expect(carregarDispositivos).toHaveBeenCalledWith("Grupo")
        expect(mockSetDispositivos).not.toHaveBeenCalled();

        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao carregar os dispositivos.")
    });
})