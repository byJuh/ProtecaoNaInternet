import { salvarSitesBloqueados, carregarGruposComQuantidadesDeSitesBloqueados, deletarSiteDoGrupo, carregarSitesBloqueadosDoGrupo } from './salvarSitesBloqueados';
import { MMKV } from '../../../utils/inicializarMMKV';
import { Alert } from 'react-native';

jest.mock('../../../utils/inicializarMMKV', () => ({
     MMKV: {
        getString: jest.fn(),
        setString: jest.fn(),
    },
}));

describe('Testes para salvarSitesBloqueados', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert');
    });

    it('Salvando sites bloqueados em um grupo novo', () => {
        (MMKV.getString as jest.Mock).mockReturnValue(null);

        salvarSitesBloqueados('Grupo1', 'site1.com');

        expect(MMKV.setString).toHaveBeenCalled();

        const dadosSalvos = JSON.parse((MMKV.setString as jest.Mock).mock.calls[0][1]);

        expect(dadosSalvos['Grupo1']).toEqual({
            sitesBloqueados: ['site1.com'],
            quantidade: 1
        });
    });

    it('Salvando sites bloqueados em um grupo existente', () => {
        const gruposExistentes = {
            'Grupo1': {
                sitesBloqueados: ['site1.com'],
                quantidade: 1
            }
        };

        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(gruposExistentes));

        salvarSitesBloqueados('Grupo1', 'site2.com');

        expect(MMKV.setString).toHaveBeenCalled();

        const dadosSalvos = JSON.parse((MMKV.setString as jest.Mock).mock.calls[0][1]);

        expect(dadosSalvos['Grupo1'].quantidade).toBe(2);

        expect(dadosSalvos['Grupo1']).toEqual({
            sitesBloqueados: ['site1.com', 'site2.com'],
            quantidade: 2
        });
    });

    it('Salvando um site que já existe no grupo', () => {
        const gruposExistentes = {
            'Grupo1': {
                sitesBloqueados: ['site1.com'],
                quantidade: 1
            }
        };

        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(gruposExistentes));

        const responde = salvarSitesBloqueados('Grupo1', 'site1.com');
        expect(responde).toBeUndefined();

        expect(Alert.alert).toHaveBeenCalledWith("Site já existe no grupo", "O site site1.com já está bloqueado no grupo Grupo1.");
        expect(MMKV.setString).not.toHaveBeenCalled();
    });

    it('Deletando site de um grupo existente', () => {
        const gruposExistentes = {
            'Grupo1': {
                sitesBloqueados: ['site1.com', 'site2.com'],
                quantidade: 2
            },
            'Grupo2': {
                sitesBloqueados: ['site3.com'],
                quantidade: 1
            }
        };

        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(gruposExistentes));

        deletarSiteDoGrupo('Grupo1', 'site1.com');

        expect(MMKV.setString).toHaveBeenCalled();

        const dadosSalvos = JSON.parse((MMKV.setString as jest.Mock).mock.calls[0][1]);

        expect(dadosSalvos['Grupo1'].quantidade).toBe(1);
        expect(dadosSalvos['Grupo1']).toEqual({
            sitesBloqueados: ['site2.com'],
            quantidade: 1
        });

        expect(dadosSalvos['Grupo2']).toEqual(gruposExistentes['Grupo2']);
    }); 

    it('Carregando grupos com quantidades de sites bloqueados', () => {
        const gruposExistentes = { 
            'Grupo1': {
                sitesBloqueados: ['site1.com', 'site2.com'],
                quantidade: 2
            },
            'Grupo2': {
                sitesBloqueados: ['site3.com'],
                quantidade: 1
            }
        };

        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(gruposExistentes));

        const resultado = carregarGruposComQuantidadesDeSitesBloqueados();

        expect(resultado.size).toBe(2);
        expect(resultado.get('Grupo1')).toBe(2);
        expect(resultado.get('Grupo2')).toBe(1);

    });

    it('Carregando sites bloqueados de um grupo específico', () => {
        const gruposExistentes = {
            'Grupo1': {
                sitesBloqueados: ['site1.com', 'site2.com'],
                quantidade: 2
            },
            'Grupo2': {
                sitesBloqueados: ['site3.com'],
                quantidade: 1
            }
        };

        (MMKV.getString as jest.Mock).mockReturnValue(JSON.stringify(gruposExistentes));

        const sitesGrupo1 = carregarSitesBloqueadosDoGrupo('Grupo1');
        expect(sitesGrupo1).toEqual(['site1.com', 'site2.com']);

        const sitesGrupo2 = carregarSitesBloqueadosDoGrupo('Grupo2');
        expect(sitesGrupo2).toEqual(['site3.com']);
    });

    it('Salvando sites bloqueados com erro no MMKV', () => {
        (MMKV.getString as jest.Mock).mockImplementation(() => {
            throw new Error("Erro no MMKV");
        });

        expect(() => {
            salvarSitesBloqueados('Grupo1', 'site1.com');
        }).toThrow("Erro ao salvar sites bloqueados");

    });

    it('Carregando grupos com quantidades de sites bloqueados com erro no MMKV', () => {
        (MMKV.getString as jest.Mock).mockImplementation(() => {
            throw new Error("Erro no MMKV");
        });

        expect(() => {
            carregarGruposComQuantidadesDeSitesBloqueados();
        }).toThrow("Erro ao carregar grupos e quantidade de sites bloqueados.");

    });

    it('Carregando sites bloqueados de um grupo específico com erro no MMKV', () => {
        (MMKV.getString as jest.Mock).mockImplementation(() => {
            throw new Error("Erro no MMKV");
        });

        expect(() => {
            carregarSitesBloqueadosDoGrupo('Grupo1');
        }).toThrow("Erro ao carregar os sites bloqueados do grupo.");
    });

    it('Deletando site de um grupo existente com erro no MMKV', () => {
        (MMKV.getString as jest.Mock).mockImplementation(() => {
            throw new Error("Erro no MMKV");
        });

        expect(() => {
            deletarSiteDoGrupo('Grupo1', 'site1.com');
        }).toThrow("Erro ao deletar site do grupo.");
    });

});

