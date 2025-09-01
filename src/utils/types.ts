//criando um tipo para a rota
export type RootStackParamList = {
    //especificar undefined = rota nao tem parametro
    Home: undefined,
    Cadastrar_Mac: {nomeGrupo: string},
    Excluir_Mac: {nomeGrupo: string},
    Tela_Explicacao: undefined,
    Cadastrar_Grupo: undefined,
    Adicionar_Dispositivo: {nomeGrupo: string},
    Desbloquear_Sites: undefined,
    Excluir_Grupo: undefined,
    Tabs: { screen: keyof TabsParamList };
}

export type Grupo = {
    quantidade: number;
    dispositivos: Dispositivo[];
}

export type GruposDispositivos = {
    [key: string]: Grupo;
}

//definindo os parametros que pode passar (telas)
export type TabsParamList = {
    Bloquear: undefined;
    AdicionarGrupos: undefined;
};;

//definindo o tipo dispositivo para salvar e pegar os dados
export type Dispositivo = {
    nome: string;
    mac: string;
};

//definindo o tipo dispositivo para salvar e pegar os dados
export type Registro = {
    domain: string;
};