import { Alert } from 'react-native';
import { MMKV } from '../../../utils/inicializarMMKV';
import { GruposSitesBloqueados } from '../../../utils/types';

export function salvarSitesBloqueados(grupo: string, sites: string){
    try{
        const gruposSalvos = MMKV.getString('gruposSitesBloqueados');
        
        let grupos: GruposSitesBloqueados = gruposSalvos ? JSON.parse(gruposSalvos) : {};

        if(grupos[grupo]) {
            // Se o grupo existe, ACRESCENTA os novos sites aos existentes
            const sitesExistentes = grupos[grupo].sitesBloqueados;

            if(sitesExistentes.includes(sites)){
                Alert.alert("Site já existe no grupo", `O site ${sites} já está bloqueado no grupo ${grupo}.`);
                return;
            }

            const sitesAtualizados = Array.from(new Set([...sitesExistentes, sites]));

            grupos[grupo] = { 
                sitesBloqueados: sitesAtualizados, 
                quantidade: sitesAtualizados.length
            };

        } else {
            // Se o grupo não existe, cria novo
            const novosSites: string[] = [sites];

            grupos[grupo] = { 
                sitesBloqueados: novosSites,
                quantidade: novosSites.length
            };
        }

        MMKV.setString('gruposSitesBloqueados', JSON.stringify(grupos));

    }catch (error){
        throw new Error("Erro ao salvar sites bloqueados");
    }
}

//Promise: Objeto que representa a Completion ou Failure de uma operação assíncrona
//Usada para lidar com tarefas que levam tempo para serem concluídas
export function carregarGruposComQuantidadesDeSitesBloqueados(): Map<string, number> {
    try{
        const sitesBloqueados = MMKV.getString('gruposSitesBloqueados');
        
        var sitesBloqueadosObject = sitesBloqueados ? JSON.parse(sitesBloqueados) : {};

        var sitesBloqueadosMap = new Map(Object.entries(sitesBloqueadosObject));
        var resultadosMap = new Map();

        for (const key of sitesBloqueadosMap.keys()) {
            var quantidade = (sitesBloqueadosMap.get(key) as {quantidade: number}).quantidade
            resultadosMap.set(key, quantidade);
        }

        return resultadosMap
    }catch(error){
        throw new Error("Erro ao carregar grupos e quantidade de sites bloqueados.");
    }
}

export function carregarSitesBloqueadosDoGrupo(nomeGrupo: string): string[] {
    try{
        const sitesBloqueadosSalvos = MMKV.getString('gruposSitesBloqueados');
        const grupos: GruposSitesBloqueados = sitesBloqueadosSalvos ? JSON.parse(sitesBloqueadosSalvos) : {};   

        if(!grupos[nomeGrupo] || !grupos[nomeGrupo].sitesBloqueados) return [];

        const sites: string[] = grupos[nomeGrupo].sitesBloqueados

        return sites
    }catch(error){
        throw new Error("Erro ao carregar os sites bloqueados do grupo.");
    }
}

export function deletarSiteDoGrupo(nomeGrupo: string, site: string) {
    try{
        const sitesBloqueadosSalvos = MMKV.getString('gruposSitesBloqueados');
        const grupos: GruposSitesBloqueados = sitesBloqueadosSalvos ? JSON.parse(sitesBloqueadosSalvos) : {};   

        if(grupos[nomeGrupo] && grupos[nomeGrupo].sitesBloqueados){
            const sitesAtualizados = grupos[nomeGrupo].sitesBloqueados.filter(s => s !== site);
            
            grupos[nomeGrupo].sitesBloqueados = sitesAtualizados;
            grupos[nomeGrupo].quantidade = sitesAtualizados.length;
            
            MMKV.setString('gruposSitesBloqueados', JSON.stringify(grupos));
        }
    }catch(error){
        throw new Error("Erro ao deletar site do grupo.");
    }
}