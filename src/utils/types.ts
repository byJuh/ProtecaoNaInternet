//criando um tipo para a rota
export type RootStackParamList = {
    //especificar undefined = rota nao tem parametro
    Home: undefined,
    Tabs: { screen: keyof TabsParamList };
}

//definindo os parametros que pode passar (telas)
export type TabsParamList = {
    Principal: undefined;
    Bloquear: undefined;
};