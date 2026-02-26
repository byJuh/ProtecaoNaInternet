import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Desbloquear_Sites from './DesbloqueioSites';
import getSitesBloqueados from '../services/getSitesBloqueados';
import RNPickerSelect from 'react-native-picker-select';
import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { Alert } from 'react-native';
import { RootStackParamList } from '../../../utils/types';
import { unblockDomain } from '../../../services/requests';
import { deletarSiteDoGrupo } from '../services/salvarSitesBloqueados';

jest.mock('react-native-picker-select', () => 'RNPickerSelect');
jest.mock("react-native-mmkv-storage");
jest.mock('../services/getSitesBloqueados');
jest.mock('../services/salvarSitesBloqueados');
jest.mock('../../../services/requests', () => ({
    unblockDomain: jest.fn(),
}));

const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace 
  })
}));


describe('Testando tela desbloquear sites', ()=> {

    beforeEach(() => {
        jest.spyOn(Alert, 'alert');
        jest.clearAllMocks();
    });

    it('Renderizando a tela desbloquear sites', () => {
        const mockRoute: RouteProp<RootStackParamList, 'Desbloquear_Sites'> = {
            key: 'any-key',
            name: 'Desbloquear_Sites',
            params: {
                nomeGrupo: 'Grupo1',
            },
        };

        const { getByText, getByTestId, getByRole } = render(<Desbloquear_Sites route={mockRoute} />);

        expect(getByTestId('picker-dispositivo').findByType(RNPickerSelect)).toBeTruthy();
        expect(getByRole('button', { name: 'Desbloquear' })).toBeTruthy();
        expect(getByText('Desbloquear')).toBeTruthy();
    }); 

    it('Testando o funcionamento da tela', async () => {
        const mockRoute: RouteProp<RootStackParamList, 'Desbloquear_Sites'> = {
            key: 'any-key',
            name: 'Desbloquear_Sites',
            params: {
                nomeGrupo: 'Grupo1',
            },
        };  

        const sites = ['site1.com', 'site2.com', 'site3.com'];

        (getSitesBloqueados as jest.Mock).mockImplementation((nomeGrupo: string, setSites: (sites: string[]) => void) => {
            setSites(sites);
        });

        (unblockDomain as jest.Mock).mockResolvedValue('Site desbloqueado com sucesso');
        (deletarSiteDoGrupo as jest.Mock).mockImplementation(() => {});

        const { getByRole, getByTestId } = render(<Desbloquear_Sites route={mockRoute} />);
        const nomeGrupo = mockRoute.params.nomeGrupo;

        expect(getSitesBloqueados).toHaveBeenCalled();

        const selectPicker = getByTestId('picker-dispositivo').findByType(RNPickerSelect);
        fireEvent(selectPicker, 'onValueChange', 'site2.com');

        expect(selectPicker.props.value).toBe('site2.com');
        const site = selectPicker.props.value;

        const button = getByRole('button', { name: 'Desbloquear' });
        fireEvent.press(button);

        expect(unblockDomain).toHaveBeenCalledWith(nomeGrupo, site);

        await waitFor(() => {
            expect(deletarSiteDoGrupo).toHaveBeenCalledWith(nomeGrupo, site);
        });

        expect(Alert.alert).toHaveBeenCalledWith('Desbloqueado', 'Site desbloqueado com sucesso');
        expect(mockReplace).toHaveBeenCalledWith('Lista_De_Bloqueio');
    });

    it('Testando falha ao desbloquear site', async () => {
        const mockRoute: RouteProp<RootStackParamList, 'Desbloquear_Sites'> = {
            key: 'any-key',
            name: 'Desbloquear_Sites',
            params: {
                nomeGrupo: 'Grupo1',
            },
        };

        const sites = ['site1.com', 'site2.com', 'site3.com'];

        (deletarSiteDoGrupo as jest.Mock).mockImplementation(() => {});
        (getSitesBloqueados as jest.Mock).mockImplementation((nomeGrupo: string, setSites: (sites: string[]) => void) => {
            setSites(sites);
        });
        (unblockDomain as jest.Mock).mockImplementation(() => {
            throw new Error("Erro de rede: Network Request Failed");
        });

        const { getByRole, getByTestId } = render(<Desbloquear_Sites route={mockRoute} />);
        const nomeGrupo = mockRoute.params.nomeGrupo;

        expect(getSitesBloqueados).toHaveBeenCalled();

        const selectPicker = getByTestId('picker-dispositivo').findByType(RNPickerSelect);
        fireEvent(selectPicker, 'onValueChange', 'site2.com');

        expect(selectPicker.props.value).toBe('site2.com');
        const site = selectPicker.props.value;

        const button = getByRole('button', { name: 'Desbloquear' });
        fireEvent.press(button);

        expect(unblockDomain).toHaveBeenCalledWith(nomeGrupo, site);

        expect(deletarSiteDoGrupo).not.toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith("Não foi possível desbloquear o site!!");

        expect(mockReplace).not.toHaveBeenCalledWith('Lista_De_Bloqueio');
    });
});

        