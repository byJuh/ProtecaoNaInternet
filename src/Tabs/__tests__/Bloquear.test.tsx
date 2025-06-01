import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Bloquear from '../Bloquear';
import fetchGrupos from '../../services/useCarregarGrupos';
import fetchDispositivos from '../../services/useCarregarDispositivosMacAddress';
import pegandoRegistros from '../../services/useCarregarListaDeSites';
import RNPickerSelect from 'react-native-picker-select';
import React, { act } from 'react';
import { Dispositivo, Registro } from '../../utils/types';
import { useFocusEffect } from '@react-navigation/native';
import { addDomainBlocklist } from '../../services/requests';

jest.mock('react-native-picker-select', () => 'RNPickerSelect');
jest.mock('react-native-bouncy-checkbox', () => 'BouncyCheckbox');
jest.mock("react-native-mmkv-storage");
jest.mock('../../services/useCarregarGrupos');
jest.mock('../../services/useCarregarDispositivosMacAddress');
jest.mock('../../services/useCarregarListaDeSites');
jest.mock('../../services/requests', () => ({
    addDomainBlocklist: jest.fn(),
}));
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

describe('Testando tela bloquear', ()=> {

    it('renderizando a tela inicial', () => {
        const {getByText, getByTestId, getByRole } = render(<Bloquear />);

        const select = getByTestId('picker-groups').findByType(RNPickerSelect);
        expect(select).toBeTruthy();

        const flatList = getByTestId('visualizacao-dominios');
        expect(flatList).toBeTruthy();

        const button = getByRole('button', {name: 'Bloquear'});
        expect(button).toBeTruthy();

        const buttonText = getByText('Bloquear');
        expect(buttonText).toBeTruthy();
    });

    it('renderizando a tela após escolher grupo', () => {
        const {getByText, getByTestId, getByRole } = render(<Bloquear />);

       (fetchGrupos as jest.Mock).mockImplementation((setGrupos, setGruposSelecionados) => {
            setGrupos(new Map([['Grupo1', 1]]));
            setGruposSelecionados('Grupo1');
        });

        expect(fetchGrupos).toHaveBeenCalled();

        const select = getByTestId('picker-groups').findByType(RNPickerSelect);
        fireEvent(select, 'onValueChange', 'Grupo1');
        expect(select.props.value).toBe('Grupo1');

        const selectDispositivos = getByTestId('picker-dispositivos').findByType(RNPickerSelect);
        expect(selectDispositivos).toBeTruthy();

        const flatList = getByTestId('visualizacao-dominios')
        expect(flatList).toBeTruthy();

        const button = getByRole('button', {name: 'Bloquear'});
        expect(button).toBeTruthy();

        const buttonText = getByText('Bloquear');
        expect(buttonText).toBeTruthy();
    });
});


describe('Testando o funcionamento da tela de bloqueio', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('testando escolha de grupos e dispositivos', async () => {
        const mockFocusEffect = useFocusEffect as jest.Mock;

        let callback: () => void;
           mockFocusEffect.mockImplementation((cb) => {
           callback = cb;
        });

        (fetchGrupos as jest.Mock).mockImplementation((setGrupos, setGruposSelecionados) => {
            const grupos = new Map<string, number>([
                ['Grupo1', 3],
            ]);
            setGrupos(grupos);
            setGruposSelecionados('Grupo1');
        });

        (fetchDispositivos as jest.Mock).mockImplementation((grupoSelecionado, setMacAddress, setDispositivos) => {
            grupoSelecionado = 'Grupo1';
            setMacAddress('FF:FF:FF:FF:FF:FF');

            const dispositivos: Dispositivo[] = [{
                nome:'Filho', mac: 'FF:FF:FF:FF:FF:FF'
            }];
            setDispositivos(dispositivos);
        });

        (pegandoRegistros as jest.Mock).mockImplementation((setRegistros, macAddress) => {
            macAddress = 'FF:FF:FF:FF:FF:FF';
            const registros: Registro[] = [
                {domain: 'www.google.com.br'},
                {domain: 'www.uol.com.br'},
                {domain: 'www.terra.com.br'},
                {domain: 'www.youtube.com.br'}
            ]
            setRegistros(registros);
        });
        
        const pegandoValoresMock = jest.fn();
        const { getByText, getByTestId, getByRole } = render(<Bloquear onSelecionarDominio={pegandoValoresMock}/>);

        expect(fetchGrupos).toHaveBeenCalled();

        const select = getByTestId('picker-groups').findByType(RNPickerSelect);
        expect(select).toBeTruthy();

        //Evento de escolha de grupo
        fireEvent(select, 'onValueChange', 'Grupo1');
        expect(select.props.value).toBe('Grupo1');

        expect(fetchDispositivos).toHaveBeenCalled();

        const selectDispositivos = getByTestId('picker-dispositivos').findByType(RNPickerSelect);
        fireEvent(selectDispositivos, 'onValueChange', 'FF:FF:FF:FF:FF:FF');
        expect(selectDispositivos.props.value).toBe('FF:FF:FF:FF:FF:FF');
         
        act(() => {
            callback();
        });

        await waitFor(() => {
            expect(pegandoRegistros).toHaveBeenCalled(); 
        });

        expect(getByTestId('checkbok-domain-www.google.com.br')).toBeTruthy();
        expect(getByTestId('checkbok-domain-www.uol.com.br')).toBeTruthy();
        expect(getByTestId('checkbok-domain-www.terra.com.br')).toBeTruthy();
        expect(getByTestId('checkbok-domain-www.youtube.com.br')).toBeTruthy();
         
        const checkbox = getByTestId('checkbok-domain-www.uol.com.br');
        fireEvent.press(checkbox);
        expect(pegandoValoresMock).toHaveBeenCalledWith('www.uol.com.br');

        const flatList = getByTestId('visualizacao-dominios');
        expect(flatList.props.data).toHaveLength(4);

        const button = getByRole('button', {name: 'Bloquear'});
        fireEvent.press(button);
        
        //fetch de adicionarBloqueio
        expect(addDomainBlocklist).toHaveBeenCalledWith('www.uol.com.br', 'Grupo1');
        
        const buttonText = getByText('Bloquear');
        expect(buttonText).toBeTruthy();
    });
});
