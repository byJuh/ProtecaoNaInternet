import React, { act } from "react";
import { carregarDispositivos, carregarGrupos, deletarDispositivo, salvarDispositivos } from "../../services/salvarDispostivos";
import { addClient, createGroup } from "../../services/requests";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import CadastrarGrupos from "../CadastrarGrupos";
import Cadastro_cliente from "../CadastrarCliente";
import { RouteProp } from "@react-navigation/native";
import { Dispositivo, RootStackParamList } from "../../utils/types";

jest.mock("react-native-mmkv-storage");
jest.mock('@react-navigation/native-stack');
jest.mock('../../services/requests');
jest.mock('../../services/salvarDispostivos');
jest.mock('react-native-picker-select', () => 'RNPickerSelect');

const mockNavigate= jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('Testando tela de cadastrar cliente', () => {
    const mockRoute: RouteProp<RootStackParamList, 'Cadastrar_Mac'> = {
        key: 'any-key',
        name: 'Cadastrar_Mac',
        params: {
            nomeGrupo: 'Grupo',
        },
    };
    beforeEach(() => {
        jest.spyOn(Alert, 'alert');
        jest.clearAllMocks();
    });

    it('Renderizando a tela', () => {
        const {getByText, getByTestId, getByRole } = render(<Cadastro_cliente route={mockRoute}/>);
        
        expect(getByTestId('input-macAddress')).toBeTruthy();
        expect(getByTestId('input-nomeDispositivo')).toBeTruthy();

        expect(getByRole('button', {name: 'Como encontrar o mac address?'})).toBeTruthy();
        expect(getByText('Como encontrar o mac address?')).toBeTruthy();

        expect(getByRole('button', {name: 'Adicionar'})).toBeTruthy();
        expect(getByText('Adicionar')).toBeTruthy();
    });

    it('Testando o funcionamento da tela', async () => {

        const dispositivos: Dispositivo[] = [];

        (carregarDispositivos as jest.Mock).mockReturnValue(dispositivos);
        (salvarDispositivos as jest.Mock).mockImplementation(() => {});
        (addClient as jest.Mock).mockResolvedValue('Cliente 11:22:33:C4:A4:55 foi inserido no grupo Grupo com sucesso')

        const { getByTestId, getByRole } = render(<Cadastro_cliente route={mockRoute}/>);
        
        const nomeGrupo = mockRoute.params.nomeGrupo;

        const inputMac = getByTestId('input-macAddress');
        fireEvent.changeText(inputMac, '11:22:33:C4:A4:55');

        const inputNome = getByTestId('input-nomeDispositivo');
        fireEvent.changeText(inputNome, 'Celular');

        const button = getByRole('button', {name: 'Adicionar'});
        fireEvent.press(button);

        expect(carregarDispositivos).toHaveBeenCalledWith(nomeGrupo);
        expect(salvarDispositivos).toHaveBeenCalledWith(inputNome.props.value, inputMac.props.value, nomeGrupo);

        await waitFor(() => {
            expect(addClient).toHaveBeenCalledWith(inputMac.props.value, nomeGrupo);
        })

        expect(Alert.alert).toHaveBeenCalledWith(
            'Sucesso',
            'Cliente 11:22:33:C4:A4:55 foi inserido no grupo Grupo com sucesso',
            expect.arrayContaining([
                expect.objectContaining({ text: 'Ok' })
            ])
        );

        const confirmAlert = (Alert.alert as jest.Mock).mock.calls[0][2].find((b: { text: string; }) => b.text === 'Ok');
        await act(async () => {
            await confirmAlert.onPress();
        })

        expect(mockNavigate).toHaveBeenCalledWith('Tabs', { screen: 'Bloquear' });

    });

    it('Testando erro de campo vazio (macAddress)', async () => {

        const { getByTestId, getByRole } = render(<Cadastro_cliente route={mockRoute}/>);

        const inputMac = getByTestId('input-macAddress');
        fireEvent.changeText(inputMac, '');

        const inputNome = getByTestId('input-nomeDispositivo');
        fireEvent.changeText(inputNome, 'Celular');

        const button = getByRole('button', {name: 'Adicionar'});
        fireEvent.press(button);

        expect(carregarDispositivos).not.toHaveBeenCalled();
        expect(salvarDispositivos).not.toHaveBeenCalled();

        expect(addClient).not.toHaveBeenCalledWith();

        expect(Alert.alert).toHaveBeenCalledWith("Preencha todos os campos!");

        
        expect(mockNavigate).not.toHaveBeenCalledWith('Tabs', { screen: 'Bloquear' });

    });

    it('Testando erro de campo vazio (nomeDispositivo)', async () => {

        const { getByTestId, getByRole } = render(<Cadastro_cliente route={mockRoute}/>);

        const inputMac = getByTestId('input-macAddress');
        fireEvent.changeText(inputMac, '11:22:33:C4:A4:55');

        const inputNome = getByTestId('input-nomeDispositivo');
        fireEvent.changeText(inputNome, '');

        const button = getByRole('button', {name: 'Adicionar'});
        fireEvent.press(button);

        expect(carregarDispositivos).not.toHaveBeenCalled();
        expect(salvarDispositivos).not.toHaveBeenCalled();

        expect(addClient).not.toHaveBeenCalledWith();

        expect(Alert.alert).toHaveBeenCalledWith("Preencha todos os campos!");

        
        expect(mockNavigate).not.toHaveBeenCalledWith('Tabs', { screen: 'Bloquear' });

    });


    it('Testando erro de campo vazio (ambos)', async () => {

        const { getByTestId, getByRole } = render(<Cadastro_cliente route={mockRoute}/>);

        const inputMac = getByTestId('input-macAddress');
        fireEvent.changeText(inputMac, '');

        const inputNome = getByTestId('input-nomeDispositivo');
        fireEvent.changeText(inputNome, '');

        const button = getByRole('button', {name: 'Adicionar'});
        fireEvent.press(button);

        expect(carregarDispositivos).not.toHaveBeenCalled();
        expect(salvarDispositivos).not.toHaveBeenCalled();

        expect(addClient).not.toHaveBeenCalledWith();

        expect(Alert.alert).toHaveBeenCalledWith("Preencha todos os campos!");

        
        expect(mockNavigate).not.toHaveBeenCalledWith('Tabs', { screen: 'Bloquear' });

    });

    it('Testando erro de dispositivo já criado', async () => {

        const dispositivos: Dispositivo[] = [{
            nome:'Filho', mac: '11:22:33:C4:A4:55'
        }];

        (carregarDispositivos as jest.Mock).mockReturnValue(dispositivos);
        
        const { getByTestId, getByRole } = render(<Cadastro_cliente route={mockRoute}/>);
        
        const nomeGrupo = mockRoute.params.nomeGrupo;

        const inputMac = getByTestId('input-macAddress');
        fireEvent.changeText(inputMac, '11:22:33:C4:A4:55');

        const inputNome = getByTestId('input-nomeDispositivo');
        fireEvent.changeText(inputNome, 'Celular');

        const button = getByRole('button', {name: 'Adicionar'});
        fireEvent.press(button);

        expect(carregarDispositivos).toHaveBeenCalledWith(nomeGrupo);

        expect(Alert.alert).toHaveBeenCalledWith(
            'Erro',
            'Esse dispositivo já está no grupo!!',
            expect.arrayContaining([
                expect.objectContaining({ text: 'Ok' })
            ])
        );

        const confirmAlert = (Alert.alert as jest.Mock).mock.calls[0][2].find((b: { text: string; }) => b.text === 'Ok');
        await act(async () => {
            await confirmAlert.onPress();
        })

        expect(mockNavigate).toHaveBeenCalledWith('Tabs', { screen: 'AdicionarGrupos' });

        expect(salvarDispositivos).not.toHaveBeenCalled();
        expect(addClient).not.toHaveBeenCalled();
    });


    it('Testando erro ao salvar dispositivo no MMKV', async () => {

        const dispositivos: Dispositivo[] = [{
            nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'
        }];

        (carregarDispositivos as jest.Mock).mockReturnValue(dispositivos);
        (salvarDispositivos as jest.Mock).mockImplementation(() => {
            throw new Error("Erro ao salvar dispostivo");
        });
        (deletarDispositivo as jest.Mock).mockReturnValue(() => {});
        
        const { getByTestId, getByRole } = render(<Cadastro_cliente route={mockRoute}/>);
        
        const nomeGrupo = mockRoute.params.nomeGrupo;

        const inputMac = getByTestId('input-macAddress');
        fireEvent.changeText(inputMac, '11:22:33:C4:A4:55');

        const inputNome = getByTestId('input-nomeDispositivo');
        fireEvent.changeText(inputNome, 'Celular');

        const button = getByRole('button', {name: 'Adicionar'});
        fireEvent.press(button);

        expect(carregarDispositivos).toHaveBeenCalledWith(nomeGrupo);
        expect(salvarDispositivos).toHaveBeenCalledWith(inputNome.props.value, inputMac.props.value, nomeGrupo);

        expect(Alert.alert).toHaveBeenCalledWith('Erro', "Erro ao salvar dispostivo");
        //expect(deletarDispositivo).toHaveBeenCalledWith(inputNome.props.value, inputMac.props.value, nomeGrupo);

        expect(addClient).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();

    });

    it('Testando erro ao carregar dispositivos', async () => {

        const dispositivos: Dispositivo[] = [{
            nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'
        }];

        (carregarDispositivos as jest.Mock).mockImplementation(() => {
            throw new Error("Erro ao carregar os dispositivos.");
        });
        
        const { getByTestId, getByRole } = render(<Cadastro_cliente route={mockRoute}/>);
        
        const nomeGrupo = mockRoute.params.nomeGrupo;

        const inputMac = getByTestId('input-macAddress');
        fireEvent.changeText(inputMac, '11:22:33:C4:A4:55');

        const inputNome = getByTestId('input-nomeDispositivo');
        fireEvent.changeText(inputNome, 'Celular');

        const button = getByRole('button', {name: 'Adicionar'});
        fireEvent.press(button);

       
        expect(carregarDispositivos).toHaveBeenCalledWith(nomeGrupo);

        expect(Alert.alert).toHaveBeenCalledWith('Erro', "Erro ao carregar os dispositivos.");
        //expect(deletarDispositivo).toHaveBeenCalledWith(inputNome.props.value, inputMac.props.value, nomeGrupo);

        expect(salvarDispositivos).not.toHaveBeenCalled();

        expect(addClient).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();

    });

    it('Testando erro ao adicionar client via fetch', async () => {

        const dispositivos: Dispositivo[] = [{
            nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'
        }];

        (carregarDispositivos as jest.Mock).mockReturnValue(dispositivos);
        (salvarDispositivos as jest.Mock).mockImplementation(() => {});
        (addClient as jest.Mock).mockImplementation(() => {
            throw new Error("Erro de rede: Network Request Failed")
        })
        
        const { getByTestId, getByRole } = render(<Cadastro_cliente route={mockRoute}/>);
        
        const nomeGrupo = mockRoute.params.nomeGrupo;

        const inputMac = getByTestId('input-macAddress');
        fireEvent.changeText(inputMac, '11:22:33:C4:A4:55');

        const inputNome = getByTestId('input-nomeDispositivo');
        fireEvent.changeText(inputNome, 'Celular');

        const button = getByRole('button', {name: 'Adicionar'});
        fireEvent.press(button);

       
        expect(carregarDispositivos).toHaveBeenCalledWith(nomeGrupo);
        expect(salvarDispositivos).toHaveBeenCalledWith(inputNome.props.value, inputMac.props.value, nomeGrupo);

        expect(addClient).toHaveBeenCalledWith(inputMac.props.value, nomeGrupo);

        expect(Alert.alert).toHaveBeenCalledWith('Erro', "Erro de rede: Network Request Failed");
        expect(mockNavigate).not.toHaveBeenCalled();

        
        //expect(deletarDispositivo).toHaveBeenCalledWith(inputNome.props.value, inputMac.props.value, nomeGrupo);


    });

    it('Testando erro ao adicionar client via fetch', async () => {

        const dispositivos: Dispositivo[] = [{
            nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'
        }];

        (carregarDispositivos as jest.Mock).mockReturnValue(dispositivos);
        (salvarDispositivos as jest.Mock).mockImplementation(() => {});
        (addClient as jest.Mock).mockResolvedValue(undefined);
        
        const { getByTestId, getByRole } = render(<Cadastro_cliente route={mockRoute}/>);
        
        const nomeGrupo = mockRoute.params.nomeGrupo;

        const inputMac = getByTestId('input-macAddress');
        fireEvent.changeText(inputMac, '11:22:33:C4:A4:55');

        const inputNome = getByTestId('input-nomeDispositivo');
        fireEvent.changeText(inputNome, 'Celular');

        const button = getByRole('button', {name: 'Adicionar'});
        fireEvent.press(button);

       
        expect(carregarDispositivos).toHaveBeenCalledWith(nomeGrupo);
        expect(salvarDispositivos).toHaveBeenCalledWith(inputNome.props.value, inputMac.props.value, nomeGrupo);

        await waitFor(() => {
            expect(addClient).toHaveBeenCalledWith(inputMac.props.value, nomeGrupo);
        });
       
        expect(Alert.alert).toHaveBeenCalledWith('Erro', "Erro ao salvar o dispositivo!!");
        expect(deletarDispositivo).toHaveBeenCalledWith(inputNome.props.value, inputMac.props.value, nomeGrupo);

        expect(mockNavigate).not.toHaveBeenCalled();

        
        
    });
});