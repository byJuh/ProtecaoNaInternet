import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../../constants/styles";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../utils/types";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export default function TelaExplicacao(){

    const navigation = useNavigation<NavigationProps>();

    return(
        <View style={[styles.container, {backgroundColor: "#C8D9E6"}]}>
            <View style={styles.blocoTitulo}>
                <TouchableOpacity accessibilityRole = 'button' accessibilityLabel="Voltar para Home" style={{marginRight: 20}} 
                    onPress={() => navigation.replace('Home')}
                >
                    <MaterialIcons name='arrow-back' color='#FFFFFF' size={35}/>
                </TouchableOpacity>
                <Text style={styles.textoTitulo}>
                    Criando Grupo de Dispositivos
                </Text>
            </View>
            <View style={styles.explicacao}>
                <Text style={styles.textoExplicativo}>
                    Criando Grupos: {"\n\n"}
                    {'\t'} 1. Os grupos servem para organizações dos dispositvos. {"\n\n"}
                    {'\t'} 2. Primeiramente será criado um grupo e um disposivo desse grupo.
                </Text>
            </View>
            <TouchableOpacity accessibilityRole = 'button' style={[styles.btn, {position: 'absolute', bottom: '5%'}]}
                onPress={() => navigation.navigate('Cadastrar_Grupo')}
            >
                <Text style={styles.btnTexto}>
                    Continuar
                </Text>
            </TouchableOpacity>
            
        </View>
    )
}