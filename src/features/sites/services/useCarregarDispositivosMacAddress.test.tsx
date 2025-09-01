import { Alert } from "react-native";
import { Dispositivo } from "../../../utils/types";
import fetchDispositivos from "./useCarregarDispositivosMacAddress";

jest.mock("../salvarDispostivos");
jest.mock("react-native-mmkv-storage");

describe('Testando o fetchDispositivos', () => {
    const mockSetDispositivos = jest.fn();
    const mockSetMacAddress = jest.fn();
    const { carregarDispositivos } = require("../salvarDispostivos");

    beforeEach(() =>{
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert');
    })

    it('Carregando os dispositivos e os macAddress', () => {
        const dispositivos: Dispositivo[] = [{
            nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'
        }];
        
        
        (carregarDispositivos as jest.Mock).mockReturnValue(dispositivos);

        fetchDispositivos("Grupo", mockSetMacAddress, mockSetDispositivos);

        expect(carregarDispositivos).toHaveBeenCalledWith("Grupo");
        expect(carregarDispositivos("Grupo")).toHaveLength(1);

        expect(mockSetMacAddress).toHaveBeenCalledWith("FF:FF:FF:FF:FF:FF");
        expect(mockSetDispositivos).toHaveBeenCalledWith(dispositivos);
    });

    it("Dispositivos salvos maior que um", () => {
        const dispositivos: Dispositivo[] = [
            {nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'},
            {nome: 'Filho2', mac: 'AA:AA:AA:AA:AA:AA'}
        ];
        
        
        (carregarDispositivos as jest.Mock).mockReturnValue(dispositivos);

        fetchDispositivos("Grupo", mockSetMacAddress, mockSetDispositivos);

        expect(carregarDispositivos).toHaveBeenCalledWith("Grupo");
        expect(carregarDispositivos("Grupo")).toHaveLength(2);

        expect(mockSetMacAddress).not.toHaveBeenCalled();
        expect(mockSetDispositivos).toHaveBeenCalledWith(dispositivos);
    });

    it("Dispositivos salvos igual a 0", () => {
        const dispositivos: Dispositivo[] = [];
        
        (carregarDispositivos as jest.Mock).mockReturnValue(dispositivos);

        fetchDispositivos("Grupo", mockSetMacAddress, mockSetDispositivos);

        expect(carregarDispositivos).toHaveBeenCalledWith("Grupo");
        expect(carregarDispositivos("Grupo")).toHaveLength(0);

        expect(mockSetMacAddress).not.toHaveBeenCalled();
        expect(mockSetDispositivos).toHaveBeenCalledWith(dispositivos);
    });

    //Lidando com erro
    it('Lidando com erro de JSON', () => {
        (carregarDispositivos as jest.Mock).mockImplementation(() => {
            throw new Error("Erro ao carregar os dispositivos.");
        });
    
        fetchDispositivos("Grupo", mockSetMacAddress, mockSetDispositivos);
            
        expect(carregarDispositivos).toHaveBeenCalledWith("Grupo")
        expect(mockSetDispositivos).not.toHaveBeenCalled();
        expect(mockSetDispositivos).not.toHaveBeenCalledWith();
    
        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao carregar os dispositivos.")
    });

})