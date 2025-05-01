//criando um tipo para a rota
export type RootStackParamList = {
    //especificar undefined = rota nao tem parametro
    Home: undefined,
    Cadastrar_Mac: undefined,
    Excluir_Mac: undefined,
    Tabs: { screen: keyof TabsParamList };
}

//definindo os parametros que pode passar (telas)
export type TabsParamList = {
    Principal: undefined;
    Bloquear: undefined;
};

//definindo o tipo dispositivo para salvar e pegar os dados
export type Dispositivo = {
    nome: string;
    mac: string;
};