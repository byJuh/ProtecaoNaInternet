import React, { act } from "react";
import { carregarDispositivos, carregarGrupos, deletarGrupo } from "../../services/salvarDispostivos";
import { deleteGroup } from "../../services/requests";
import { fireEvent, render } from "@testing-library/react-native";
import ExcluirGrupo from "../ExcluirGrupo";
import RNPickerSelect from 'react-native-picker-select';
import { Alert } from "react-native";
import { Dispositivo } from "../../utils/types";

jest.mock("react-native-mmkv-storage");
jest.mock('@react-navigation/native-stack');
jest.mock('../../services/requests');
jest.mock('../../services/salvarDispostivos');
jest.mock('react-native-picker-select', () => 'RNPickerSelect');

const mockReplace= jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace
  })
}));

describe("Testando tela excluir grupo", ()  => {
    
    beforeEach(() => {
        jest.spyOn(Alert, 'alert');
        jest.clearAllMocks();
    })

    it("Renderizando a tela", () => {
        const {getByText, getByTestId, getByRole } = render(<ExcluirGrupo />);

        expect(getByTestId('picker-groups').findByType(RNPickerSelect)).toBeTruthy();
        expect(getByRole('button', {name: 'Excluir'})).toBeTruthy();
        expect(getByText('Excluir')).toBeTruthy();
        
    });

    it("Testando o funcionamento da tela", async () => {
        const grupos = new Map<string, number>([
            ['Grupo1', 3],
            ['Grupo2', 0]
        ]);

         const dispositivos: Dispositivo[] = [{
            nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'
        }];

    
        (carregarGrupos as jest.Mock).mockReturnValue(grupos);
        (carregarDispositivos as jest.Mock).mockReturnValue(dispositivos);
        (deleteGroup as jest.Mock).mockResolvedValue('Grupo Grupo2 foi removido');
        (deletarGrupo as jest.Mock).mockImplementation(() => {});

        const { getByTestId, getByRole } = render(<ExcluirGrupo />);
        
        expect(carregarGrupos).toHaveBeenCalled();

        const select = getByTestId('picker-groups').findByType(RNPickerSelect);
        fireEvent(select, 'onValueChange', 'Grupo2');

        expect(select.props.value).toBe('Grupo2');

        const button = getByRole('button', {name: 'Excluir'});
        fireEvent.press(button);


        expect(Alert.alert).toHaveBeenCalledWith(
            'Confirmação',
            'Tem certeza que deseja excluir o grupo: Grupo2? \n\n       Irá excluir os dispositivos também!!',
            expect.arrayContaining([
                expect.objectContaining({ text: 'Sim' }),
                expect.objectContaining({ text: 'Não' }),
            ]),
            { cancelable: false }
        );
        

        let confirmAlert = (Alert.alert as jest.Mock).mock.calls[0][2].find((b: { text: string; }) => b.text === 'Sim');
        await confirmAlert.onPress();
        
        expect(carregarDispositivos).toHaveBeenCalledWith('Grupo2');
        expect(carregarDispositivos).toHaveBeenCalled();
        expect(deleteGroup).toHaveBeenCalledWith('Grupo2', dispositivos.map(d=>d.mac));

        expect(deletarGrupo).toHaveBeenCalledWith('Grupo2');

        expect(Alert.alert).toHaveBeenNthCalledWith(2,
            'Removido',
            'Grupo: Grupo2 foi removido!',
            expect.arrayContaining([
                expect.objectContaining({ text: 'Ok' })
            ])
        );

        confirmAlert = (Alert.alert as jest.Mock).mock.calls[1][2].find((b: { text: string; }) => b.text === 'Ok');
        await act(async () => {
            await confirmAlert.onPress();
        })
        
        expect(mockReplace).toHaveBeenCalledWith('Tabs', { screen: 'Bloquear' });
    });

    it("Testando não na confirmação", async () => {
        const grupos = new Map<string, number>([
            ['Grupo1', 3],
            ['Grupo2', 0]
        ]);

        (carregarGrupos as jest.Mock).mockReturnValue(grupos);

        const { getByTestId, getByRole } = render(<ExcluirGrupo />);
        
        expect(carregarGrupos).toHaveBeenCalled();

        const select = getByTestId('picker-groups').findByType(RNPickerSelect);
        fireEvent(select, 'onValueChange', 'Grupo1');

        expect(select.props.value).toBe('Grupo1');

        const button = getByRole('button', {name: 'Excluir'});
        fireEvent.press(button);

        expect(Alert.alert).toHaveBeenCalledWith(
            'Confirmação',
            'Tem certeza que deseja excluir o grupo: Grupo1? \n\n       Irá excluir os dispositivos também!!',
            expect.arrayContaining([
                expect.objectContaining({ text: 'Sim' }),
                expect.objectContaining({ text: 'Não' }),
            ]),
            { cancelable: false }
        );
        

        const confirmAlert = (Alert.alert as jest.Mock).mock.calls[0][2].find((b: { text: string; }) => b.text === 'Não');
        await confirmAlert.onPress();

        expect(mockReplace).toHaveBeenCalledWith('Tabs', {screen: 'AdicionarGrupos'});
    });

    it("Testando erro ao carregar o grupo", () => {
        (carregarGrupos as jest.Mock).mockImplementation(() => {
            throw new Error("Erro ao carregar grupos.");
        });

        render(<ExcluirGrupo />);
        
        expect(carregarGrupos).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao carregar grupos.")
        
    });

    it("Testando erro ao carregar os dispositivos", async () => {

        const grupos = new Map<string, number>([
            ['Grupo1', 3],
            ['Grupo2', 0]
        ]);

        (carregarGrupos as jest.Mock).mockReturnValue(grupos);
        (carregarDispositivos as jest.Mock).mockImplementation(() => {
            throw new Error("Erro ao carregar os dispositivos.");
        });

        const { getByTestId, getByRole } = render(<ExcluirGrupo />);
        
        expect(carregarGrupos).toHaveBeenCalled();

        const select = getByTestId('picker-groups').findByType(RNPickerSelect);
        fireEvent(select, 'onValueChange', 'Grupo1');

        expect(select.props.value).toBe('Grupo1');

        const button = getByRole('button', {name: 'Excluir'});
        fireEvent.press(button);

        expect(Alert.alert).toHaveBeenCalledWith(
            'Confirmação',
            'Tem certeza que deseja excluir o grupo: Grupo1? \n\n       Irá excluir os dispositivos também!!',
            expect.arrayContaining([
                expect.objectContaining({ text: 'Sim' }),
                expect.objectContaining({ text: 'Não' }),
            ]),
            { cancelable: false }
        );
        

        const confirmAlert = (Alert.alert as jest.Mock).mock.calls[0][2].find((b: { text: string; }) => b.text === 'Sim');
        await confirmAlert.onPress();
        
        expect(carregarDispositivos).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith("Não foi possível remover!!")
        
    });

    it("Testando erro ao deletar grupo", async () => {
        const grupos = new Map<string, number>([
            ['Grupo1', 3],
            ['Grupo2', 0]
        ]);

        const dispositivos: Dispositivo[] = [{
            nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'
        }];

        (carregarGrupos as jest.Mock).mockReturnValue(grupos);
        (carregarDispositivos as jest.Mock).mockReturnValue(dispositivos);
        (deleteGroup as jest.Mock).mockImplementation(() => {
            throw new Error("Erro de rede: Network Request Failed");
        });

        const { getByTestId, getByRole } = render(<ExcluirGrupo />);
        
        expect(carregarGrupos).toHaveBeenCalled();

        const select = getByTestId('picker-groups').findByType(RNPickerSelect);
        fireEvent(select, 'onValueChange', 'Grupo2');

        expect(select.props.value).toBe('Grupo2');

        const button = getByRole('button', {name: 'Excluir'});
        fireEvent.press(button);

        expect(Alert.alert).toHaveBeenCalledWith(
            'Confirmação',
            'Tem certeza que deseja excluir o grupo: Grupo2? \n\n       Irá excluir os dispositivos também!!',
            expect.arrayContaining([
                expect.objectContaining({ text: 'Sim' }),
                expect.objectContaining({ text: 'Não' }),
            ]),
            { cancelable: false }
        );
        

        const confirmAlert = (Alert.alert as jest.Mock).mock.calls[0][2].find((b: { text: string; }) => b.text === 'Sim');
        await confirmAlert.onPress();
        
        expect(carregarDispositivos).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith("Não foi possível remover!!")
        
    });

    it("Testando erro ao deletar grupo no MMKV", async () => {
        const grupos = new Map<string, number>([
            ['Grupo1', 3],
            ['Grupo2', 0]
        ]);

         const dispositivos: Dispositivo[] = [{
            nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'
        }];

    
        (carregarGrupos as jest.Mock).mockReturnValue(grupos);
        (carregarDispositivos as jest.Mock).mockReturnValue(dispositivos);
        (deleteGroup as jest.Mock).mockResolvedValue('Grupo Grupo2 foi removido');
        (deletarGrupo as jest.Mock).mockImplementation(() => {
            throw new Error("Erro ao deletar grupo.");
        });
        
        const { getByTestId, getByRole } = render(<ExcluirGrupo />);
        
        expect(carregarGrupos).toHaveBeenCalled();

        const select = getByTestId('picker-groups').findByType(RNPickerSelect);
        fireEvent(select, 'onValueChange', 'Grupo2');

        expect(select.props.value).toBe('Grupo2');

        const button = getByRole('button', {name: 'Excluir'});
        fireEvent.press(button);

        expect(Alert.alert).toHaveBeenCalledWith(
            'Confirmação',
            'Tem certeza que deseja excluir o grupo: Grupo2? \n\n       Irá excluir os dispositivos também!!',
            expect.arrayContaining([
                expect.objectContaining({ text: 'Sim' }),
                expect.objectContaining({ text: 'Não' }),
            ]),
            { cancelable: false }
        );
        

        const confirmAlert = (Alert.alert as jest.Mock).mock.calls[0][2].find((b: { text: string; }) => b.text === 'Sim');
        await confirmAlert.onPress();
        
        expect(carregarDispositivos).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith("Não foi possível remover!!")
        
    });

})